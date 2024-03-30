export function generateRandomCPF(): string {
  const randomNumber = (length: number) =>
    Math.floor(Math.random() * Math.pow(10, length))

  const cpfDigits = Array.from({ length: 9 }, () => randomNumber(9))

  const sum = cpfDigits.reduce(
    (acc, value, index) => acc + value * (10 - index),
    0,
  )
  const firstCheckDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  const sum2 =
    cpfDigits.reduce((acc, value, index) => acc + value * (11 - index), 0) +
    firstCheckDigit * 2
  const secondCheckDigit = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11)

  return cpfDigits.concat([firstCheckDigit, secondCheckDigit]).join('')
}
