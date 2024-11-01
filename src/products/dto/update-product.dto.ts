import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({
        description: 'Location',
        default: 'West Malaysia',
    })
    @IsNotEmpty()
    location: string;

    @IsNumber()
    price: number;
}
