import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cors());
    app.enableCors({
        origin: '*',
        methods: 'GET, PUT, POST, DELETE, PATCH',
        allowedHeaders: 'Content-Type, Authorization'
    });
    await app.listen(3001);
}
bootstrap();
