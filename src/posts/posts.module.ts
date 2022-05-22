import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/helpers/schema/post.schema';
import { UserSchema } from 'src/helpers/schema/user.schema';
import { CommentSchema } from 'src/helpers/schema/comments.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Post', schema: PostSchema },
            { name: 'User', schema: UserSchema },
            { name: 'Comment', schema: CommentSchema }
        ])
    ],
    controllers: [PostsController],
    providers: [PostsService]
})
export class PostsModule {}
