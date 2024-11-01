import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductDto {
    @IsNotEmpty()
    location: string;

    @IsNumber()
    price: number;
}
