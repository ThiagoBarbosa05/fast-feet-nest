import { Module } from '@nestjs/common'
import { RegisterAdministratorController } from './controllers/register-administrator.controller'
import { RegisterAdministratorUseCase } from '@/domain/shipping-company/application/use-cases/register-administrator'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [RegisterAdministratorController],
  providers: [RegisterAdministratorUseCase],
})
export class HttpModule {}
