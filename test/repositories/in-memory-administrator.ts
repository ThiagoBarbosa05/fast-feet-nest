import { AdministratorRepository } from '@/domain/shipping-company/application/repositories/administrator'
import { Administrator } from '@/domain/shipping-company/enterprise/entities/administrator'

export class InMemoryAdministratorRepository
  implements AdministratorRepository
{
  public items: Administrator[] = []

  async create(administrator: Administrator) {
    this.items.push(administrator)
  }

  async findByDocument(document: string) {
    const admin = this.items.find((ad) => ad.document.toValue() === document)

    if (!admin) return null

    return admin
  }
}
