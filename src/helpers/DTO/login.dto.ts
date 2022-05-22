import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @IsString()
    usernameOrEmail: string;
    @IsString()
    password: string;
}

export class SignupDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    password: string;

}

export class EditDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    username: string;

}
