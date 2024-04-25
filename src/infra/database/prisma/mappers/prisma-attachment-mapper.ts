import { Attachment } from '@/domain/shipping-company/enterprise/entities/attachments'
import { Prisma } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toPrisma(attachment: Attachment): Prisma.AttachmentCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
