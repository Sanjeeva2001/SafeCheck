export const ITERATIONS = ['it1', 'it2']

export const DEFAULT_ITERATION = ITERATIONS[0]

export const PAGE_PATHS = {
  home: '',
  'url-verifier': 'url-verifier',
  'tnc-simplifier': 'tnc-simplifier',
  'scam-quiz': 'scam-quiz',
}

const iterationPattern = new RegExp(`^/(${ITERATIONS.join('|')})(?=/|$)`)

export function getIterationFromPath(path) {
  const match = path.match(iterationPattern)
  return match?.[1] || DEFAULT_ITERATION
}

export function buildIterationPath(iteration, page) {
  const pagePath = PAGE_PATHS[page] ?? ''

  if (!pagePath) {
    return `/${iteration}`
  }

  return `/${iteration}/${pagePath}`
}
