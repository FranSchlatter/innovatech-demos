/* Simulated network latency so loading states are real (Fase 1 requirement). */
export function delay(min = 200, max = 600) {
  const ms = min + Math.floor(Math.random() * (max - min))
  return new Promise((res) => setTimeout(res, ms))
}

/** Wrap a sync data getter so it resolves async with latency. */
export function withLatency(fn, min, max) {
  return async (...args) => {
    await delay(min, max)
    return fn(...args)
  }
}

/** Deterministic pseudo-random from a string seed (stable demo data). */
export function seeded(seedStr) {
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const img = (seed, w = 800, h = 600) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`
