import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  app.enableCors({
    origin: ['http://localhost:4200', 'https://p7-ocr.netlify.app'],
    credentials: true,
  })

  await app.listen(process.env.PORT || 8080)
}
bootstrap()
