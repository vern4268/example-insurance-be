import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'Product code',
        default: 1001,
    })
    @IsNotEmpty()
    productCode: string;

    @ApiProperty({
        description: 'Location',
        default: 'West Malaysia',
    })
    @IsNotEmpty()
    location: string;

    @IsNumber()
    price: number;
}
