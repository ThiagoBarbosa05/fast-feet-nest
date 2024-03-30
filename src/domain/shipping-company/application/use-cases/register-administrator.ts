import { Either, left, right } from '@/core/either'
import { Administrator } from '../../enterprise/entities/administrator'
import { Document } from '../../enterprise/entities/value-objects.ts/document'
import { HashGenerator } from '../cryptography/hash-generator'
import { AdministratorRepository } from '../repositories/administrator'
import { AdministratorAlreadyExistsError } from './errors/administrator-already-exists-error'
import { InvalidDocumentError } from './errors/invalid-document-error'
import { Injectable } from '@nestjs/common'

interface RegisterAdministratorUseCaseRequest {
  name: string
  document: string
  password: string
}

type RegisterAdministratorUseCaseResponse = Either<
  AdministratorAlreadyExistsError | InvalidDocumentError,
  {
    administrator: Administrator
  }
>

@Injectable()
export class RegisterAdministratorUseCase {
  constructor(
    private hashGenerator: HashGenerator,
    private administratorRepository: AdministratorRepository,
  ) {}

  async execute({
    document,
    name,
    password,
  }: RegisterAdministratorUseCaseRequest): Promise<RegisterAdministratorUseCaseResponse> {
    const hashedPassword = await this.hashGenerator.hash(password)
    const adminDocument = new Document(document.toString())

    if (!adminDocument.validateCpf()) {
      return left(new InvalidDocumentError())
    }

    const administratorAlreadyExists =
      await this.administratorRepository.findByDocument(
        adminDocument.toString(),
      )

    if (administratorAlreadyExists) {
      return left(new AdministratorAlreadyExistsError())
    }

    const administrator = Administrator.create({
      document: adminDocument,
      name,
      password: hashedPassword,
    })

    await this.administratorRepository.create(administrator)

    return right({
      administrator,
    })
  }
}
