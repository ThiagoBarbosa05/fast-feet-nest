import { Module } from '@nestjs/common'
import { RegisterAdministratorController } from './controllers/register-administrator.controller'
import { RegisterAdministratorUseCase } from '@/domain/shipping-company/application/use-cases/register-administrator'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { RegisterDeliverymanController } from './controllers/register-deliveryman.controller'
import { RegisterDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/register-deliveryman'
import { AuthenticateController } from './controllers/authenticate.controller'
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
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/shipping-company/application/use-cases/delete-recipient'
import { EditRecipientController } from './controllers/edit-recipient.controller'
import { EditRecipientUseCase } from '@/domain/shipping-company/application/use-cases/edit-recipient'
import { FetchDeliverymanController } from './controllers/fetch-deliveryman.controller'
import { FetchDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/fetch-deliveryman'
import { FetchOrdersByDeliverymanIdController } from './controllers/fetch-orders-by-deliveryman-id.controller'
import { FetchOrdersByDeliverymanIdUseCase } from '@/domain/shipping-company/application/use-cases/fetch-orders-by-deliveryman-id'
import { GetOrderByRecipientIdController } from './controllers/get-order-by-delivery-id.controller'
import { GetOrderByRecipientIdUseCase } from '@/domain/shipping-company/application/use-cases/get-order-by-recipient-id'
import { ListOrderNearDeliverymanAddressController } from './controllers/list-order-near-deliveryman-address.controller'
import { ListOrderNearDeliverymanAddressUseCase } from '@/domain/shipping-company/application/use-cases/list-order-near-deliveryman-address'
import { MarkOrderAsPickupController } from './controllers/mark-order-as-pickup.controller'
import { MarkOrderAsPickupUseCase } from '@/domain/shipping-company/application/use-cases/mark-order-as-pickup'
import { UploadAttachmentController } from './controllers/upload-attachments.controller'
import { UploadAndCreateAttachmentUseCase } from '@/domain/shipping-company/application/use-cases/upload-and-create-attachment'
import { StorageModule } from '../storage/storage.module'
import { MarkOrderAsDeliveredController } from './controllers/mark-order-as-delivered.controller'
import { MarkOrderAsDeliveredUseCase } from '@/domain/shipping-company/application/use-cases/mark-order-as-delivered'
import { MarkOrderAsReturnedController } from './controllers/mark-order-as-returned.controller'
import { MarkOrderAsReturnedUseCase } from '@/domain/shipping-company/application/use-cases/mark-order-as-returned'

@Module({
  imports: [CryptographyModule, DatabaseModule, StorageModule],
  controllers: [
    RegisterAdministratorController,
    RegisterDeliverymanController,
    AuthenticateController,
    AuthenticateAdministratorController,
    EditDeliverymanController,
    DeleteDeliverymanController,
    CreateRecipientAndOrder,
    DeleteRecipientController,
    EditRecipientController,
    FetchDeliverymanController,
    FetchOrdersByDeliverymanIdController,
    GetOrderByRecipientIdController,
    ListOrderNearDeliverymanAddressController,
    MarkOrderAsPickupController,
    UploadAttachmentController,
    MarkOrderAsReturnedController,
    MarkOrderAsDeliveredController,
  ],
  providers: [
    RegisterAdministratorUseCase,
    RegisterDeliverymanUseCase,
    CreateOrderUseCase,
    CreateRecipientUseCase,
    DeleteDeliverymanUseCase,
    EditDeliverymanUseCase,
    EditRecipientUseCase,
    FetchDeliverymanUseCase,
    FetchOrdersByDeliverymanIdUseCase,
    ListOrderNearDeliverymanAddressUseCase,
    GetOrderByRecipientIdUseCase,
    DeleteRecipientUseCase,
    MarkOrderAsPickupUseCase,
    UploadAndCreateAttachmentUseCase,
    AuthenticateAdministratorUseCase,
    MarkOrderAsDeliveredUseCase,
    MarkOrderAsReturnedUseCase,
    AuthenticateDeliverymanUseCase,
  ],
})
export class HttpModule {}
