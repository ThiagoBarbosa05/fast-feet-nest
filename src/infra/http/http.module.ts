import { Module } from '@nestjs/common'
import { RegisterAdministratorController } from './controllers/register-administrator.controller'
import { RegisterAdministratorUseCase } from '@/domain/shipping-company/application/use-cases/register-administrator'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { RegisterDeliverymanController } from './controllers/register-deliveryman.controller'
import { RegisterDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/register-deliveryman'
import { AuthenticateController } from './controllers/authenticate.controller'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    RegisterAdministratorController,
    RegisterDeliverymanController,
    AuthenticateController,
  ],
  providers: [RegisterAdministratorUseCase, RegisterDeliverymanUseCase],
})
export class HttpModule {}