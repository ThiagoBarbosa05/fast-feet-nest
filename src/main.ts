import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './infra/env/env'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('Fast Feet API')
    .setDescription('Fast Feet API Documentation')
    .setVersion('1.0')
    .addTag('Fast Feet')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const configService: ConfigService<Env, true> = app.get(ConfigService)
  const port = configService.get('PORT', { infer: true })
  await app.listen(port)
}
bootstrap()
