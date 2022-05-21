import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/helpers/schema/post.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }])
    ],
    controllers: [PostsController],
    providers: [PostsService]
})
export class PostsModule {}
