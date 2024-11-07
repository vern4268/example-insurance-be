import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { Role } from 'src/common/enum/role.enum';

export class LoginDto {
    @ApiProperty({
        description: "Login with either 'user' or 'admin'",
        default: 'user',
    })
    @IsNotEmpty()
    @IsString()
    role: Role;
}
