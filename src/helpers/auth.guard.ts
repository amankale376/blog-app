import {
    Injectable,
    CanActivate,
    ExecutionContext,
    applyDecorators,
    UseGuards,
    createParamDecorator,
    BadGatewayException,
    UnauthorizedException
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { Reflector } from '@nestjs/core';

import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const ROLES_KEY = 'roles';

@Injectable()
export class RestAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const requiredRoles = this.reflector.get<Role[]>(
            ROLES_KEY,
            context.getHandler()
        );
        if (req.headers && req.headers.authorization) {
            req.user = await this.validateToken(req.headers.authorization);
            if (!requiredRoles) {
                return true;
            } else {
                return requiredRoles.includes(req.user.role);
            }
        }
        return false;
    }

    async validateToken(auth: string) {
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new BadGatewayException('jwt bearer missing');
        }

        const token = auth.split(' ')[1];
        const reqUser = await jwt.verify(token, process.env.JWT_SECRET);
        if (reqUser) {
            return reqUser;
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}

export function Auth(...roles: Role[]) {
    SetMetadata(ROLES_KEY, roles);
    return applyDecorators(UseGuards(RestAuthGuard));
}

export const GetUserId = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        return req.user;
    }
);

export const Roles = (...roles: Role[]) => {
    return SetMetadata(ROLES_KEY, roles);
};
