import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto, SignupDto } from 'src/helpers/DTO/login.dto';
import { IUser } from 'src/helpers/Interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Role } from 'src/helpers/role.enum';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {
        this.adminPresentCheck();
    }
    async adminPresentCheck() {
        try {
            const isAdminAvailable = await this.userModel.findOne({
                username: process.env.ADMIN_USERNAME
            });
            if (!isAdminAvailable) {
                const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD);
                const newAdmin = new this.userModel({
                    username: process.env.ADMIN_USERNAME,
                    password: hash,
                    name: process.env.ADMIN_NAME,
                    email: process.env.ADMIN_EMAIL,
                    role: Role.Admin
                });
                await newAdmin.save();
                console.log('admin created successfully');
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ usernameOrEmail, password }: LoginDto) {
        try {
            const isUser = await this.userModel.findOne({
                $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
            });
            if (isUser) {
                const isPassword = await bcrypt.compare(
                    password,
                    isUser.password
                );
                if (isPassword) {
                    const token = jwt.sign(
                        isUser.toObject(),
                        process.env.JWT_SECRET
                    );
                    return {
                        success: true,
                        token
                    };
                }
                throw new UnauthorizedException('Unauthorized');
            } else {
                throw new UnauthorizedException('Unauthorized');
            }
        } catch (error) {
            throw error;
        }
    }

    async getUserDetails(user) {
        try {
            const isUserAvailable = await this.userModel.findById(user._id);
            if (isUserAvailable) {
                return isUserAvailable;
            }
            throw new NotFoundException('User not available');
        } catch (error) {
            throw error;
        }
    }

    async signup({
        email,
        name,
        password,
        profilePicture,
        username
    }: SignupDto) {
        try {
            const isUserExists = await this.userModel.findOne({
                $or: [{ username }, { email }]
            });
            if (isUserExists)
                throw new BadRequestException('User already registered');
            const hash = bcrypt.hashSync(password);
            const newUser = await this.userModel.create({
                email,
                name,
                password: hash,
                profilePicture,
                username
            });
            return { success: true, ...newUser.toJSON() };
        } catch (error) {
            throw error;
        }
    }
}
