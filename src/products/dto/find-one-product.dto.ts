import { IsString } from 'class-validator';

export class FindOneDto {
    @IsString()
    productCode: string;

    @IsString()
    location: string;
}
