import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        PostsModule,
        UsersModule,
        MongooseModule.forRoot(process.env.DB_URL)
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class AppModule {}
