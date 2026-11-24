import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { NestNodeApplication, NodeAdapter } from '@nestjs/platform-node';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { SeederService } from './seeder/seeder.service.js';

async function bootstrap() {
  const app = await NestFactory.create<NestNodeApplication>(
    AppModule,
    new NodeAdapter()
  );

  const config = new DocumentBuilder()
      .setTitle('Doodle-Duels')
      .setDescription('Doodle Duels API docs')
      .setVersion('1.0')
      .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableShutdownHooks(); //for proper shutdown with docker

  app.useGlobalPipes(new ValidationPipe()); //enable dto validation

  //app.enableCsrfProtection(); //todo use when valid requests can have a different origin (the frontend, namely)

  //seed database before opening port
  const seederService = app.get(SeederService);
  await seederService.seed();

  await app.listen(process.env.APP_PORT ?? 8000); //todo use zod or some other thing for config defaults and constraints
}
await bootstrap();
