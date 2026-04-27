<script setup>
const emit = defineEmits(['navigate'])

const features = [
  {
    page: 'url-verifier',
    icon: 'link',
    title: 'Check a Link',
    desc: 'Not sure if a website is safe to visit? Paste the address and we will check it for warning signs in seconds.',
    cta: 'Check a link now',
  },
  {
    page: 'tnc-simplifier',
    icon: 'doc',
    title: 'Understand Terms & Conditions',
    desc: 'Confused by the fine print before signing up to something? We translate legal language into plain English.',
    cta: 'Simplify the fine print',
  },
  {
    page: 'scam-quiz',
    icon: 'bulb',
    title: 'Scam Awareness Quiz',
    desc: 'Test yourself with real scam scenarios. Eight short questions — no tech knowledge needed.',
    cta: 'Take the quiz',
  },
]
</script>

<template>

  <!-- ============================================================
       HERO — full-bleed navy gradient
       ============================================================ -->
  <section
    class="relative overflow-hidden"
    style="background: linear-gradient(135deg, var(--navy) 0%, #1d4ed8 100%);"
  >
    <div class="absolute inset-0 opacity-5" aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    <div class="relative px-4 py-16 sm:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <!-- Left: headline + CTAs -->
        <div class="animate-fade-in-up">

          <div class="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-base font-medium text-white">Free · No sign-up required · Nothing stored</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Stay safe online —<br/>
            <span class="text-white">simply and for free</span>
          </h1>

          <p class="text-xl text-white leading-relaxed mb-6 max-w-xl" style="opacity: 0.92;">
            SafeCheck helps you check suspicious links, understand confusing Terms &amp; Conditions,
            and learn to spot online scams — all in plain English.
          </p>

          <!-- Testimonial callout -->
          <div class="bg-white/10 rounded-2xl px-5 py-4 mb-8 border border-white/15">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full flex-shrink-0 bg-white/20 flex items-center justify-center text-white font-bold text-lg" aria-hidden="true">M</div>
              <div>
                <p class="text-white text-lg leading-relaxed italic">"I got a suspicious text about my bank. I pasted the link and SafeCheck told me it was a scam in seconds. It is so easy to use."</p>
                <p class="text-blue-200 text-base mt-1.5 font-medium">— Margaret, 68, Brisbane</p>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="emit('navigate', 'url-verifier')"
              class="btn-navy text-xl px-8 py-4 font-bold shadow-lg"
            >
              Check a link now
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              @click="emit('navigate', 'scam-quiz')"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-xl font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
            >
              Take the scam quiz
            </button>
          </div>
        </div>

        <!-- Right: warm illustration — visible from md up -->
        <div class="hidden md:flex justify-center animate-fade-in-up stagger-2">
          <div class="relative">
            <div class="w-80 h-80 rounded-3xl flex items-center justify-center" style="background-color: rgba(255,255,255,0.08);">
              <svg viewBox="0 0 320 310" class="w-72 h-72" fill="none" xmlns="http://www.w3.org/2000/svg"
                aria-label="Illustration of an older Australian woman checking a link on her phone and seeing it is safe">

                <!-- Warm glow background -->
                <circle cx="160" cy="155" r="138" fill="rgba(255,255,255,0.04)"/>

                <!-- Body — navy cardigan -->
                <path d="M90 312 Q88 245 115 228 Q138 215 160 210 Q182 215 205 228 Q232 245 230 312Z"
                  fill="rgba(100,130,190,0.65)"/>
                <!-- Cardigan V-neck / collar detail -->
                <path d="M143 210 L160 205 L177 210 L170 238 L160 244 L150 238Z"
                  fill="rgba(220,230,248,0.68)"/>

                <!-- Neck -->
                <rect x="152" y="190" width="16" height="24" rx="7" fill="rgba(252,198,158,0.95)"/>

                <!-- Head (warm peach skin) -->
                <ellipse cx="160" cy="156" rx="48" ry="52" fill="rgba(252,198,158,0.95)"/>

                <!-- Silver hair — nicely styled short cut -->
                <path d="M112 146 Q108 102 136 86 Q160 76 184 86 Q212 102 208 146 Q198 120 160 116 Q122 120 112 146Z"
                  fill="rgba(212,212,222,0.97)"/>
                <path d="M112 146 Q104 158 106 176 Q113 172 118 162Z" fill="rgba(212,212,222,0.94)"/>
                <path d="M208 146 Q216 158 214 176 Q207 172 202 162Z" fill="rgba(212,212,222,0.94)"/>
                <!-- Soft wave texture in hair -->
                <path d="M122 118 Q132 110 143 110" stroke="rgba(185,185,200,0.5)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M177 110 Q188 110 198 118" stroke="rgba(185,185,200,0.5)" stroke-width="2.5" fill="none" stroke-linecap="round"/>

                <!-- Eyebrows (soft) -->
                <path d="M136 136 Q144 131 152 133" stroke="rgba(160,140,120,0.55)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M168 133 Q176 131 184 136" stroke="rgba(160,140,120,0.55)" stroke-width="2.5" fill="none" stroke-linecap="round"/>

                <!-- Eyes (warm brown) -->
                <ellipse cx="144" cy="148" rx="8" ry="7" fill="rgba(88,62,44,0.9)"/>
                <ellipse cx="176" cy="148" rx="8" ry="7" fill="rgba(88,62,44,0.9)"/>
                <circle cx="145.5" cy="146" r="2.5" fill="rgba(255,255,255,0.92)"/>
                <circle cx="177.5" cy="146" r="2.5" fill="rgba(255,255,255,0.92)"/>
                <!-- Soft crow's feet -->
                <path d="M185 144 Q190 140 191 146" stroke="rgba(200,155,110,0.22)" stroke-width="1.2" fill="none"/>
                <path d="M135 144 Q130 140 129 146" stroke="rgba(200,155,110,0.22)" stroke-width="1.2" fill="none"/>

                <!-- Glasses (rectangular frames) -->
                <rect x="132" y="142" width="22" height="16" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(80,82,106,0.88)" stroke-width="2.5"/>
                <rect x="166" y="142" width="22" height="16" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(80,82,106,0.88)" stroke-width="2.5"/>
                <path d="M154 150 L166 150" stroke="rgba(80,82,106,0.88)" stroke-width="2.2"/>
                <path d="M132 150 Q122 149 120 146" stroke="rgba(80,82,106,0.85)" stroke-width="2" stroke-linecap="round" fill="none"/>
                <path d="M188 150 Q198 149 200 146" stroke="rgba(80,82,106,0.85)" stroke-width="2" stroke-linecap="round" fill="none"/>

                <!-- Nose (subtle) -->
                <path d="M157 164 Q160 170 163 164" stroke="rgba(200,145,100,0.42)" stroke-width="1.8" fill="none"/>

                <!-- BIG WARM SMILE -->
                <path d="M141 178 Q160 198 179 178" stroke="rgba(190,110,65,0.78)" stroke-width="3.2" fill="none" stroke-linecap="round"/>
                <circle cx="138" cy="175" r="2.5" fill="rgba(220,150,110,0.28)"/>
                <circle cx="182" cy="175" r="2.5" fill="rgba(220,150,110,0.28)"/>
                <!-- Warm cheek blush -->
                <ellipse cx="130" cy="170" rx="14" ry="9" fill="rgba(255,140,110,0.14)"/>
                <ellipse cx="190" cy="170" rx="14" ry="9" fill="rgba(255,140,110,0.14)"/>

                <!-- Right arm holding phone -->
                <path d="M205 238 Q240 248 254 264" stroke="rgba(252,198,158,0.92)" stroke-width="18" stroke-linecap="round" fill="none"/>
                <ellipse cx="257" cy="270" rx="14" ry="11" fill="rgba(252,198,158,0.92)"/>

                <!-- Phone -->
                <rect x="246" y="254" width="38" height="64" rx="8" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.55)" stroke-width="2"/>
                <rect x="249" y="258" width="32" height="52" rx="5" fill="rgba(255,255,255,0.09)"/>
                <!-- Screen content lines -->
                <rect x="252" y="262" width="26" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
                <rect x="254" y="269" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.18)"/>
                <!-- Green checkmark = SAFE result -->
                <circle cx="265" cy="285" r="13" fill="rgba(74,222,128,0.28)" stroke="rgba(74,222,128,0.75)" stroke-width="1.8"/>
                <path d="M259 285 l4 4 l9-9" stroke="rgba(74,222,128,1)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="256" y="302" width="18" height="4" rx="2" fill="rgba(74,222,128,0.55)"/>

                <!-- Left arm -->
                <path d="M115 238 Q88 250 76 268" stroke="rgba(252,198,158,0.88)" stroke-width="16" stroke-linecap="round" fill="none"/>

                <!-- Shield badge top right -->
                <circle cx="264" cy="80" r="26" fill="rgba(74,222,128,0.2)" stroke="rgba(74,222,128,0.55)" stroke-width="1.5"/>
                <path d="M264 68 Q264 68 254 72 L254 82 Q254 92 264 96 Q274 92 274 82 L274 72 Z" fill="rgba(74,222,128,0.46)"/>
                <path d="M258 82 l3.5 3.5 l8.5-8.5" stroke="rgba(74,222,128,1)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>

                <!-- Sparkles -->
                <circle cx="90" cy="100" r="2.5" fill="rgba(255,255,255,0.25)"/>
                <circle cx="78" cy="140" r="1.8" fill="rgba(255,255,255,0.18)"/>
                <circle cx="234" cy="108" r="2" fill="rgba(255,255,255,0.2)"/>
                <circle cx="235" cy="130" r="3" fill="rgba(74,222,128,0.22)"/>
              </svg>
            </div>

            <!-- Floating "safe" badge -->
            <div class="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">Link checked</p>
                <p class="text-xs text-green-600 font-semibold">This site is safe ✓</p>
              </div>
            </div>

            <!-- Floating "warning" badge -->
            <div class="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background: #fef3c7;">
                <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">T&amp;C flagged</p>
                <p class="text-xs text-amber-700 font-semibold">Data sharing clause found</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ============================================================
       HOW WE CAN HELP
       ============================================================ -->
  <section class="py-16 sm:py-20 px-4" style="background-color: var(--bg);">

    <div class="text-center mb-12 animate-fade-in-up">
      <h2 class="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">How can we help you today?</h2>
      <p class="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Three free tools — each designed to be simple, no matter your tech experience.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <button
        v-for="(f, index) in features"
        :key="f.page"
        @click="emit('navigate', f.page)"
        class="bg-white rounded-2xl p-8 text-left border-2 border-slate-100 hover:border-blue-900 hover:shadow-xl transition-all duration-200 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-900 animate-fade-in-up"
        :class="index === 0 ? 'stagger-1' : index === 1 ? 'stagger-2' : 'stagger-3'"
        style="box-shadow: 0 1px 4px rgba(0,0,0,0.06);"
      >
        <div
          class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105 duration-200"
          style="background-color: var(--navy-tint);"
        >
          <svg v-if="f.icon === 'link'" class="w-8 h-8" style="color: var(--navy);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <svg v-else-if="f.icon === 'doc'" class="w-8 h-8" style="color: var(--navy);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="w-8 h-8" style="color: var(--navy);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        <p class="text-2xl font-bold text-slate-900 mb-3 leading-snug">{{ f.title }}</p>
        <p class="text-lg text-slate-600 leading-relaxed mb-6">{{ f.desc }}</p>

        <div class="flex items-center gap-2 text-lg font-semibold group-hover:gap-3 transition-all" style="color: var(--navy);">
          {{ f.cta }}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  </section>

  <!-- ============================================================
       WHO IS THIS FOR
       ============================================================ -->
  <section class="py-16 px-4 bg-white">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      <div class="grid grid-cols-2 gap-4 animate-fade-in-up">

        <div class="col-span-2 rounded-2xl p-8 flex items-center gap-6" style="background-color: var(--navy-tint); border: 1px solid #bfdbfe;">
          <div class="flex-shrink-0">
            <svg viewBox="0 0 120 120" class="w-24 h-24" fill="none" aria-label="Illustration of a person reading on a phone">
              <rect x="38" y="25" width="44" height="72" rx="7" fill="#1e3a8a" />
              <rect x="42" y="31" width="36" height="58" rx="4" fill="#e8f4fd" />
              <rect x="46" y="36" width="28" height="3" rx="1.5" fill="#1e3a8a" opacity="0.5"/>
              <rect x="46" y="42" width="24" height="3" rx="1.5" fill="#93c5fd" opacity="0.7"/>
              <rect x="46" y="48" width="28" height="3" rx="1.5" fill="#93c5fd" opacity="0.5"/>
              <circle cx="60" cy="68" r="10" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
              <path d="M55 68 l3 3 l7-7" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="60" cy="92" r="4" fill="#374151" opacity="0.3"/>
              <circle cx="22" cy="50" r="14" fill="#fde68a" opacity="0.9"/>
              <path d="M10 50 Q10 36 22 36 Q34 36 34 50" fill="#d1d5db"/>
              <path d="M17 54 Q22 59 27 54" stroke="#92400e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
              <rect x="15" y="48" width="6" height="4" rx="2" fill="none" stroke="#374151" stroke-width="1.2"/>
              <rect x="23" y="48" width="6" height="4" rx="2" fill="none" stroke="#374151" stroke-width="1.2"/>
              <path d="M21 50 L23 50" stroke="#374151" stroke-width="1.2"/>
              <path d="M30 60 Q36 65 38 72" stroke="#fde68a" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.9"/>
            </svg>
          </div>
          <div>
            <p class="text-xl font-bold text-slate-900 mb-2">Received a suspicious link by text?</p>
            <p class="text-lg text-slate-600 leading-relaxed">Paste it into SafeCheck before you tap. Takes just a few seconds.</p>
          </div>
        </div>

        <div class="rounded-2xl p-6 flex flex-col items-center text-center" style="background-color: var(--navy-tint); border: 1px solid #bfdbfe;">
          <svg viewBox="0 0 100 80" class="w-20 h-16 mb-3" fill="none" aria-label="Illustration of a person at a laptop">
            <rect x="15" y="30" width="70" height="40" rx="4" fill="#1e3a8a"/>
            <rect x="19" y="34" width="62" height="32" rx="2" fill="#bfdbfe"/>
            <rect x="23" y="38" width="40" height="3" rx="1.5" fill="#1e3a8a" opacity="0.4"/>
            <rect x="23" y="44" width="30" height="3" rx="1.5" fill="#93c5fd" opacity="0.6"/>
            <rect x="10" y="70" width="80" height="6" rx="3" fill="#374151" opacity="0.5"/>
            <circle cx="50" cy="18" r="12" fill="#fde68a" opacity="0.9"/>
            <path d="M38 18 Q38 6 50 6 Q62 6 62 18" fill="#d1d5db"/>
          </svg>
          <p class="text-base font-bold text-slate-900">Confused by fine print?</p>
          <p class="text-sm text-slate-600 mt-1">We translate it for you</p>
        </div>

        <div class="rounded-2xl p-6 flex flex-col items-center text-center" style="background-color: var(--navy);">
          <div class="w-14 h-14 rounded-full mb-3 flex items-center justify-center bg-white/10">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p class="text-base font-bold text-white">Test your scam radar</p>
          <p class="text-sm text-blue-200 mt-1">8 quick questions</p>
        </div>

      </div>

      <div class="animate-fade-in-up stagger-2">
        <p class="text-sm font-semibold uppercase tracking-widest mb-3" style="color: var(--navy);">Designed for everyday Australians</p>
        <h2 class="text-4xl font-bold text-slate-900 mb-6 leading-tight">
          You shouldn't need to be a tech expert to stay safe online
        </h2>
        <p class="text-xl text-slate-600 leading-relaxed mb-6">
          Online scams cost Australians over 65 more than a billion dollars every year.
          SafeCheck gives you the same tools the experts use — in language everyone can understand.
        </p>

        <div class="space-y-4">
          <div v-for="point in [
            'Results in plain English — no technical jargon',
            'No account, no password, no personal details needed',
            'Works on phones, tablets, and computers',
            'Completely free — always',
          ]" :key="point" class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style="background-color: var(--navy);">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-lg text-slate-700">{{ point }}</p>
          </div>
        </div>

        <button
          @click="emit('navigate', 'url-verifier')"
          class="btn-navy mt-8 text-xl px-8 py-4"
        >
          Get started — it's free
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </div>
  </section>

  <!-- ============================================================
       TRUST STATS
       ============================================================ -->
  <section class="py-12 px-4 border-t border-slate-100" style="background-color: var(--bg);">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
      <div v-for="stat in [
        { value: 'Free',  label: 'Always free to use'        },
        { value: '3',     label: 'Tools in one place'        },
        { value: '0',     label: 'Personal details needed'   },
        { value: '24/7',  label: 'Available any time'        },
      ]" :key="stat.label" class="flex flex-col items-center gap-1">
        <span class="text-4xl font-bold" style="color: var(--navy);">{{ stat.value }}</span>
        <span class="text-base text-slate-600">{{ stat.label }}</span>
      </div>
    </div>
  </section>

</template>
