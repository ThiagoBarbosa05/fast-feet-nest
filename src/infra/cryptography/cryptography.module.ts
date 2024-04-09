import { HashComparer } from '@/domain/shipping-company/application/cryptography/hash-comparer'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerator } from '@/domain/shipping-company/application/cryptography/hash-generator'
import { Encrypter } from '@/domain/shipping-company/application/cryptography/encrypter'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: Encrypter, useClass: JwtEncrypter },
  ],
  exports: [HashComparer, HashGenerator, Encrypter],
})
export class CryptographyModule {}
