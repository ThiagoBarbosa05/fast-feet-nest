import { Address } from './address'

test('it should be able to create an address', () => {
  const address = new Address(
    'Rua x',
    'Rio de Janeiro',
    'Rio de Janeiro',
    '28951-730',
  )

  expect(address.city).toBe('Rio de Janeiro')
})
