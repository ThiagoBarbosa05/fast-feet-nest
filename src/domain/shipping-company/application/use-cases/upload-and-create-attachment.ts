import { Either, left, right } from '@/core/either'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { Attachment } from '../../enterprise/entities/attachments'
import { AttachmentsRepository } from '../repositories/attachments'
import { Uploader } from '../storage/uploader'
import { Injectable } from '@nestjs/common'

interface UploadAndCreateAttachmentRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadAndCreateAttachmentRequest): Promise<UploadAndCreateAttachmentResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
