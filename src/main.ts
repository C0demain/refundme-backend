import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Refundme API")
    .setDescription("refundme backend documentation")
    .setVersion("1.0")
    .addServer("http://localhost:3000", "Development Server")
    .addServer("http://api-5semestre.ddns.net:3000", "Production Server")
    .addBearerAuth()
    .setLicense("MIT License", "https://opensource.org/licenses/MIT")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
