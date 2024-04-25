import { AttachmentsRepository } from '@/domain/shipping-company/application/repositories/attachments'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { Attachment } from '@/domain/shipping-company/enterprise/entities/attachments'

@Injectable()
export class PrismaAttachmentRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment) {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.create({ data })
  }
}
