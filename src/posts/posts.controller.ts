import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Auth, GetUserId, Roles } from 'src/helpers/auth.guard';
import {
    CreateCommentDto,
    CreatePostDto,
    DeletePostDto
} from 'src/helpers/DTO/post.dto';
import { Role } from 'src/helpers/role.enum';
import { PostsService } from './posts.service';

@Controller()
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post('createPost')
    @Auth()
    @Roles(Role.Admin, Role.User)
    async createPost(@GetUserId() user, @Body() createPostDto: CreatePostDto) {
        return await this.postsService.createPost(user, createPostDto);
    }

    @Post('deletePost')
    @Auth()
    async deletePost(@GetUserId() user, @Body() deletePostDto: DeletePostDto) {
        return await this.postsService.deletePost(user, deletePostDto);
    }

    @Get('getAllPosts')
    async getAllPosts(
        @Query('limit') limit: string,
        @Query('offset') offset: string,
        @Query('sort') sort: string
    ) {
        return await this.postsService.getAllPosts(
            limit,
            parseInt(offset),
            sort
        );
    }

    @Get('getUserPosts')
    @Auth()
    @Roles(Role.Admin, Role.User)
    async getUserPosts(
        @GetUserId() user,
        @Query('limit') limit: string,
        @Query('offset') offset: string,
        @Query('sort') sort: string
    ) {
        return await this.postsService.getUserPosts(user, limit, offset, sort);
    }

    @Post('createComment')
    @Auth()
    @Roles(Role.Admin, Role.User)
    async createComment(
        @GetUserId() user,
        @Body() createCommentDto: CreateCommentDto
    ) {
        return await this.postsService.createComment(user, createCommentDto);
    }
}
