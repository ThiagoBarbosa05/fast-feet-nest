import { Module } from '@nestjs/common'
import { RegisterAdministratorController } from './controllers/register-administrator.controller'
import { RegisterAdministratorUseCase } from '@/domain/shipping-company/application/use-cases/register-administrator'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { RegisterDeliverymanController } from './controllers/register-deliveryman.controller'
import { RegisterDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/register-deliveryman'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ListController } from './controllers/list.controller'
import { AuthenticateDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/authenticate-deliveryman'
import { AuthenticateAdministratorController } from './controllers/authenticate-administrator.controller'
import { AuthenticateAdministratorUseCase } from '@/domain/shipping-company/application/use-cases/authenticate-administrator'
import { EditDeliverymanController } from './controllers/edit-deliveryman.controller'
import { EditDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/edit-deliveryman'
import { DeleteDeliverymanController } from './controllers/delete-deliveryman.controller'
import { DeleteDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/delete-deliveryman'
import { CreateRecipientAndOrder } from './controllers/create-recipient-and-order.controller'
import { CreateOrderUseCase } from '@/domain/shipping-company/application/use-cases/create-order'
import { CreateRecipientUseCase } from '@/domain/shipping-company/application/use-cases/create-recipient'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    RegisterAdministratorController,
    RegisterDeliverymanController,
    AuthenticateController,
    AuthenticateAdministratorController,
    EditDeliverymanController,
    DeleteDeliverymanController,
    CreateRecipientAndOrder,
    ListController,
  ],
  providers: [
    RegisterAdministratorUseCase,
    RegisterDeliverymanUseCase,
    CreateOrderUseCase,
    CreateRecipientUseCase,
    DeleteDeliverymanUseCase,
    EditDeliverymanUseCase,
    AuthenticateAdministratorUseCase,
    AuthenticateDeliverymanUseCase,
  ],
})
export class HttpModule {}
