import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Auth, GetUserId, Roles } from 'src/helpers/auth.guard';
import { CreatePostDto, DeletePostDto } from 'src/helpers/DTO/post.dto';
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
    @Roles(Role.Admin, Role.User)
    async deletePost(@GetUserId() user, @Body() deletePostDto: DeletePostDto) {
        return await this.postsService.deletePost(user, deletePostDto);
    }

    @Get('getAllPosts')
    async getAllPosts(
        @Query('limit') limit: string,
        @Query('offset') offset: string,
        @Query('sort') sort: string
    ) {
        console.log('this was hit');
        return await this.postsService.getAllPosts(limit, offset, sort);
    }

    @Get('getUserPosts')
    @Auth()
    @Roles(Role.Admin, Role.User)
    async getUserPosts(@GetUserId() user) {
        return await this.postsService.getUserPosts(user);
    }
}
