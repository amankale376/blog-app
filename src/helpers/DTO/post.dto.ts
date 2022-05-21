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