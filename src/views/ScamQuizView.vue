<script setup>
import { computed, ref } from 'vue'
import { scamQuizQuestions } from '../data/scamQuizData.js'

const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const showFeedback = ref(false)
const score = ref(0)
const quizFinished = ref(false)

const knowledgeTips = [
  {
    title: 'Pause before acting',
    text: 'If a message makes you feel worried or rushed, stop. Scammers use urgency on purpose.',
  },
  {
    title: 'Use official websites and apps',
    text: 'Never use a link from a text or email. Type the address yourself or open the official app.',
  },
  {
    title: 'Never share passwords or banking codes',
    text: 'Your bank, myGov, and service providers will never ask for these over the phone or by message.',
  },
  {
    title: 'Hang up on unexpected callers asking for computer access',
    text: 'No real company should call you first and ask to control your device.',
  },
]

const currentQuestion = computed(() => scamQuizQuestions[currentQuestionIndex.value])
const totalQuestions = computed(() => scamQuizQuestions.length)
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.correctIndex)
const progressPercent = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)

const scoreMessage = computed(() => {
  if (score.value <= 1) {
    return 'You may need more practice. Read the tips below before clicking links or sharing your details with anyone.'
  }

  if (score.value <= 3) {
    return 'Good start. You recognised some warning signs. A few scams can still be hard to spot, so keep reading the tips.'
  }

  return 'Great work. You recognised most warning signs. Keep pausing before you click, pay, or share any details.'
})

function selectAnswer(index) {
  if (showFeedback.value) return

  selectedAnswer.value = index
  showFeedback.value = true

  if (index === currentQuestion.value.correctIndex) {
    score.value += 1
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value += 1
    selectedAnswer.value = null
    showFeedback.value = false
  } else {
    quizFinished.value = true
  }
}

function tryAgain() {
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  showFeedback.value = false
  score.value = 0
  quizFinished.value = false
}
</script>

<template>
  <section style="background: linear-gradient(135deg, var(--navy) 0%, #1d4ed8 100%);">
    <div class="px-8 sm:px-16 py-12 sm:py-16">
      <div class="text-center max-w-3xl mx-auto animate-fade-in-up">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 bg-white/15">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          Scam Quiz
        </h1>
        <p class="text-xl text-white leading-relaxed" style="opacity: 0.92;">
          Practise spotting scam warning signs in common messages, calls, and emails.
          Choose what you would do, then read the plain-English explanation.
        </p>
      </div>
    </div>
  </section>

  <section class="py-12 px-8 sm:px-16" style="background-color: var(--bg);">
    <div class="max-w-5xl mx-auto space-y-8">
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in-up">
        <div v-if="!quizFinished" class="p-6 sm:p-8">
          <div class="mb-7">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <p class="text-lg font-semibold" style="color: var(--navy);">
                Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
              </p>
              <p class="text-lg font-semibold text-slate-600">
                Score: {{ score }} / {{ totalQuestions }}
              </p>
            </div>
            <div class="w-full bg-blue-100 rounded-full h-3">
              <div
                class="h-3 rounded-full transition-all duration-500"
                style="background-color: var(--navy);"
                :style="{ width: `${progressPercent}%` }"
              ></div>
            </div>
          </div>

          <div class="mb-7">
            <p class="text-base font-semibold text-slate-500 uppercase tracking-wide mb-3">Scenario</p>
            <p class="text-2xl text-slate-800 leading-relaxed">
              {{ currentQuestion.scenario }}
            </p>
          </div>

          <div class="space-y-3">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="option"
              type="button"
              :disabled="showFeedback"
              @click="selectAnswer(index)"
              class="w-full text-left text-xl border-2 rounded-xl px-5 py-4 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-default"
              :class="{
                'border-slate-200 text-slate-700 hover:border-blue-900 hover:bg-blue-50': !showFeedback,
                'border-green-500 bg-green-50 text-green-900': showFeedback && index === currentQuestion.correctIndex,
                'border-red-400 bg-red-50 text-red-900': showFeedback && selectedAnswer === index && index !== currentQuestion.correctIndex,
                'border-slate-100 text-slate-500 bg-slate-50': showFeedback && selectedAnswer !== index && index !== currentQuestion.correctIndex,
              }"
            >
              <span class="font-bold mr-2">{{ String.fromCharCode(65 + index) }}.</span>
              {{ option }}
            </button>
          </div>

          <div
            v-if="showFeedback"
            class="mt-7 rounded-xl border p-5 animate-fade-in-up"
            :class="isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
          >
            <p
              class="text-xl font-bold mb-3"
              :class="isCorrect ? 'text-green-800' : 'text-red-800'"
            >
              {{ isCorrect ? 'Correct answer' : 'Incorrect answer' }}
            </p>
            <p class="text-lg text-slate-800 leading-relaxed mb-4">
              {{ currentQuestion.explanation }}
            </p>
            <div class="rounded-lg bg-white/70 border border-slate-200 p-4">
              <p class="text-base font-bold text-slate-700 uppercase tracking-wide mb-1">Warning sign</p>
              <p class="text-lg text-slate-700 leading-relaxed">{{ currentQuestion.warningSign }}</p>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <button
              type="button"
              class="btn-navy text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!showFeedback"
              @click="nextQuestion"
            >
              {{ currentQuestionIndex === totalQuestions - 1 ? 'See my score' : 'Next Question' }}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div v-else class="p-8 sm:p-10 text-center animate-fade-in-up">
          <div class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style="background-color: var(--navy-tint);">
            <svg class="w-12 h-12" style="color: var(--navy);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-base font-semibold text-slate-500 uppercase tracking-wide mb-2">Final score</p>
          <h2 class="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            {{ score }} out of {{ totalQuestions }}
          </h2>
          <p class="text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto mb-8">
            {{ scoreMessage }}
          </p>
          <button type="button" class="btn-navy text-xl px-10 py-4" @click="tryAgain">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-in-up">
        <h2 class="text-3xl font-bold text-slate-900 mb-3">Knowledge Tips</h2>
        <p class="text-lg text-slate-600 leading-relaxed mb-6">
          Keep these simple checks in mind before you click a link, pay money, or share personal details.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="tip in knowledgeTips"
            :key="tip.title"
            class="rounded-xl border border-slate-200 p-5"
            style="background-color: var(--navy-tint);"
          >
            <p class="text-xl font-bold mb-2" style="color: var(--navy);">{{ tip.title }}</p>
            <p class="text-lg text-slate-700 leading-relaxed">{{ tip.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
