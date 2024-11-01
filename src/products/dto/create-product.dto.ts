import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    productCode: string;

    @IsNotEmpty()
    location: string;

    @IsNumber()
    price: number;
}
