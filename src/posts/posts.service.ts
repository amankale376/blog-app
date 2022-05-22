import {
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CreateCommentDto,
    CreatePostDto,
    DeletePostDto
} from 'src/helpers/DTO/post.dto';
import { IComments } from 'src/helpers/Interfaces/comments.interface';
import { IPost } from 'src/helpers/Interfaces/post.interface';
import { IUser } from 'src/helpers/Interfaces/user.interface';
import { Role } from 'src/helpers/role.enum';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<IPost>,
        @InjectModel('User') private readonly userModel: Model<IUser>,
        @InjectModel('Comment') private readonly commentModel: Model<IComments>
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
            if (!isUser) throw new UnauthorizedException('user not found');
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
            sort = parseInt(sort) || -1;
            const allPosts = await this.postModel.aggregate([
                { $sort: { createdAt: sort } },
                { $skip: offset },
                { $limit: +limit },
                {
                    $addFields: {
                        userObjectId: { $toObjectId: '$user' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userObjectId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $addFields: {
                        postIdToString: { $toString: '$_id' }
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: 'postIdToString',
                        foreignField: 'post',
                        as: 'comments'
                    }
                }
            ]);
            const totalDocuments = await this.postModel.find().count();
            let hasMore = false;
            if (offset + allPosts.length < totalDocuments) {
                hasMore = true;
            }
            return { success: true, allPosts, hasMore };
        } catch (error) {
            throw error;
        }
    }

    async getUserPosts(user, limit, offset, sort) {
        try {
            limit = +limit || 10;
            offset = +offset || 0;
            sort = parseInt(sort) || -1;
            const isUser = await this.userModel.findById(user._id);
            if (!isUser) throw new UnauthorizedException('unauthorized');
            if (isUser.role === Role.Admin) {
                const { success, allPosts, hasMore } = await this.getAllPosts(
                    limit,
                    offset,
                    sort
                );
                return { success, posts: allPosts, hasMore };
            }
            const allPosts = await this.postModel.aggregate([
                {
                    $addFields: {
                        userStringId: { $toString: '$user' }
                    }
                },
                { $match: { userStringId: user._id } },
                { $sort: { createdAt: sort } },
                { $skip: offset },
                { $limit: +limit },
                {
                    $addFields: {
                        userObjectId: { $toObjectId: '$user' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userObjectId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $addFields: {
                        postIdToString: { $toString: '$_id' }
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: 'postIdToString',
                        foreignField: 'post',
                        as: 'comments'
                    }
                }
            ]);
            const totalDocuments = await this.postModel
                .find({ userStringId: user._id })
                .count();
            let hasMore = false;
            if (offset + allPosts.length < totalDocuments) {
                hasMore = true;
            }
            return { success: true, posts: allPosts, hasMore };
        } catch (error) {
            throw error;
        }
    }

    async createComment(user, createCommentDto: CreateCommentDto) {
        try {
            const isUser = await this.userModel.findById(user._id);
            if (!isUser) throw new UnauthorizedException('unauthorized');
            const isPost = await this.postModel.findById(createCommentDto.post);
            if (!isPost) throw new UnauthorizedException('unauthorized');
            const newComment = await this.commentModel.create({
                comment: createCommentDto.comment,
                commentorUsername: user.username,
                post: createCommentDto.post
            });
            return { success: true, ...newComment.toJSON() };
        } catch (error) {
            throw error;
        }
    }
}
