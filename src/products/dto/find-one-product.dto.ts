import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindOneDto {
    @ApiProperty({
        description: 'Product code',
        default: 1001,
    })
    @IsString()
    productCode: string;

    @ApiProperty({
        description: 'Location',
        default: 'West Malaysia/East Malaysia',
    })
    @IsString()
    location: string;
}
