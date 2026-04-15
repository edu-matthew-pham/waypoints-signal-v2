// Session code format: XXXX-0000 (4 uppercase letters + 4 digits)
// No I or O to avoid confusion with 1 and 0
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'

export function generateSessionCode(): string {
  let letters = ''
  for (let i = 0; i < 4; i++) {
    letters += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  const digits = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `${letters}-${digits}`
}