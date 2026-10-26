/** Paleta de avatares do protótipo; a cor é fixa por pessoa (hash do nome). */
const PALETTE = [
  { bg: '#DCE9F7', fg: '#0062C4' },
  { bg: '#F6E3D3', fg: '#9A4A12' },
  { bg: '#E6E1F7', fg: '#5B3FC4' },
  { bg: '#DDF0E6', fg: '#1E7A4C' },
  { bg: '#F7E1E6', fg: '#A3324F' },
  { bg: '#E5E8EC', fg: '#3D4656' },
  { bg: '#FBEFD0', fg: '#8A6100' },
]

export function avatarColors(name: string) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}
