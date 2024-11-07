import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateProductDto {
    @ApiProperty({
        description: 'Product code',
        default: 1001,
    })
    @IsNotEmpty()
    @IsString()
    productCode: string;

    @ApiProperty({
        description: 'Location',
        default: 'West Malaysia',
    })
    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNumber()
    price: number;
}
