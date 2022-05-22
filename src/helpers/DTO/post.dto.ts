import { IsString } from 'class-validator';

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    content: string;
}

export class DeletePostDto {
    @IsString()
    postId: string;
}

export class CreateCommentDto {
    @IsString()
    post: string;

    @IsString()
    comment: string;
}
