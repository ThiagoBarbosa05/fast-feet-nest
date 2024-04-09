import { Either, left, right } from '@/core/either'
import { AdministratorRepository } from '../repositories/administrator'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'

interface AuthenticateAdministratorUseCaseRequest {
  document: string
  password: string
}

type AuthenticateAdministratorUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateAdministratorUseCase {
  constructor(
    private administratorRepository: AdministratorRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    document,
    password,
  }: AuthenticateAdministratorUseCaseRequest): Promise<AuthenticateAdministratorUseCaseResponse> {
    const administrator =
      await this.administratorRepository.findByDocument(document)

    if (!administrator) return left(new WrongCredentialsError())

    const isPasswordValid = await this.hashComparer.compare(
      password,
      administrator.password,
    )

    if (!isPasswordValid) return left(new WrongCredentialsError())

    const accessToken = await this.encrypter.encrypt({
      sub: administrator.id.toString(),
      role: 'ADMINISTRATOR',
    })

    return right({
      accessToken,
    })
  }
}
