export const EASE = [0.22, 1, 0.36, 1] as const

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
