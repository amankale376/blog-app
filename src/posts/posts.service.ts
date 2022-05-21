import {
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto, DeletePostDto } from 'src/helpers/DTO/post.dto';
import { IPost } from 'src/helpers/Interfaces/post.interface';
import { IUser } from 'src/helpers/Interfaces/user.interface';
import { Role } from 'src/helpers/role.enum';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<IPost>,
        @InjectModel('User') private readonly userModel: Model<IUser>
    ) {}

    async createPost(user, createPostDto: CreatePostDto) {
        try {
            const isUser = await this.userModel.findById(user._id);
            if (!isUser) throw new UnauthorizedException('unauthorized');
            const newPost = await this.postModel.create({
                user: user._id,
                ...createPostDto
            });
            return { success: true, ...newPost.toJSON() };
        } catch (error) {
            throw error;
        }
    }

    async deletePost(user, deletePostDto: DeletePostDto) {
        try {
            const isUser = await this.userModel.findById(user._id);
            if (!isUser) throw new UnauthorizedException('unauthorized');
            const isPost = await this.postModel.findById(deletePostDto.postId);
            if (!isPost) throw new NotFoundException('post not found');
            if (isPost.user === user._id || user.role === Role.Admin) {
                await this.postModel.deleteOne({
                    _id: deletePostDto.postId
                });
                return { success: true, message: 'post deleted' };
            }
            throw new UnauthorizedException('unauthorized');
        } catch (error) {
            throw error;
        }
    }

    async getAllPosts(limit, offset, sort) {
        try {
            limit = limit || 10;
            offset = offset || 0;
            sort = sort || -1;
            const allPosts = await this.postModel
                .find({})
                .limit(limit)
                .skip(offset)
                .sort({ createdAt: sort })
                .populate('user');
            return { success: true, allPosts };
        } catch (error) {
            throw error;
        }
    }

    async getUserPosts(user) {
        try {
            const isUser = await this.userModel.findById(user._id);
            if (!isUser) throw new UnauthorizedException('unauthorized');
            const getPosts = await this.postModel.find({ user: user._id });
            return { success: true, posts: getPosts };
        } catch (error) {
            throw error;
        }
    }
}
