import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(loginDto: LoginDto) {
        const { role } = loginDto;

        if (!Object.values(Role).includes(role)) {
            throw new NotFoundException('Role not found');
        }

        const payload = { user: role, role };

        return {
            authToken: await this.jwtService.signAsync(payload),
            ...payload,
        };
    }
}
