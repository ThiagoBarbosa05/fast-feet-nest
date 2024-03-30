import { Document } from './document'

test('it should be able to create a document', () => {
  const document = new Document('12345678909')

  expect(document.validateCpf()).toBe(true)
  expect(document.toValue()).toBe('12345678909')
})
