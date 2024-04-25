import { AttachmentsRepository } from '@/domain/shipping-company/application/repositories/attachments'
import { Attachment } from '@/domain/shipping-company/enterprise/entities/attachments'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
