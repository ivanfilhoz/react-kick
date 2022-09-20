export default function eraseLines (count: number) {
  for (let i = 0; i < count; i++) {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
  }
}
