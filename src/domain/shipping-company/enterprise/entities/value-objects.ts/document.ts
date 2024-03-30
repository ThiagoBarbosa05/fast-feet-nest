export class Document {
  private value: string

  constructor(value: string) {
    this.value = value
  }

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  // Method to validate the CPF
  validateCpf(): boolean {
    const cleanCpf = this.value.replace(/\D/g, '')

    // Check if the CPF has 11 digits
    if (cleanCpf.length !== 11) {
      return false
    }

    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return false
    }

    // Calculate check digits
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
    }
    let remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) {
      remainder = 0
    }
    if (remainder !== parseInt(cleanCpf.charAt(9))) {
      return false
    }
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
    }
    remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) {
      remainder = 0
    }
    if (remainder !== parseInt(cleanCpf.charAt(10))) {
      return false
    }

    // If all checks have passed, the CPF is valid
    return true
  }
}
