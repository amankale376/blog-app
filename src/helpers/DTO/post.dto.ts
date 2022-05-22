import { IsString } from 'class-validator';

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    pictures: string;
}

export class DeletePostDto {
    @IsString()
    postId: string;
}

export class CreateCommentDto {
    @IsString()
    postId: string;

    @IsString()
    comment: string;
}
