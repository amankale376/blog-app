import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth, GetUserId, Roles } from 'src/helpers/auth.guard';
import { EditDto, LoginDto, SignupDto } from 'src/helpers/DTO/login.dto';
import { Role } from 'src/helpers/role.enum';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private readonly service: UsersService) {}
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.service.login(loginDto);
    }

    @Get('getUserDetails')
    @Auth()
    @Roles(Role.Admin, Role.User)
    async getUserDetails(@GetUserId() user) {
        return await this.service.getUserDetails(user);
    }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return await this.service.signup(signupDto);
    }

    @Post('editUser')
    @Auth()
    @Roles(Role.User)
    async editUser(@GetUserId() user, @Body() editDto: EditDto) {
        return await this.service.editUser(user, editDto);
    }
}
