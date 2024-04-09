import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { RegisterAdministratorController } from './controllers/register-administrator.controller'
import { RegisterAdministratorUseCase } from '@/domain/shipping-company/application/use-cases/register-administrator'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { RegisterDeliverymanController } from './controllers/register-deliveryman.controller'
import { RegisterDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/register-deliveryman'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ListController } from './controllers/list.controller'
import { AuthenticateDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/authenticate-deliveryman'
import { RoleMiddleware } from './middlewares/role.middleware'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    RegisterAdministratorController,
    RegisterDeliverymanController,
    AuthenticateController,
    ListController,
  ],
  providers: [
    RegisterAdministratorUseCase,
    RegisterDeliverymanUseCase,
    AuthenticateDeliverymanUseCase,
  ],
})
export class HttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RoleMiddleware).forRoutes('users')
  }
}
