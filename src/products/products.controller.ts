import { Controller, Get, Post, Body, Delete, Query, Put } from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindOneDto } from './dto/find-one-product.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
@ApiBearerAuth()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @Roles(Role.Admin)
    async create(@Body() createProductDto: CreateProductDto) {
        return await this.productsService.create(createProductDto);
    }

    @Get()
    @Roles(Role.Admin, Role.User)
    async findOne(@Query() findOneDto: FindOneDto) {
        return await this.productsService.findOne(findOneDto);
    }

    @Put()
    @Roles(Role.Admin)
    async update(
        @Query('productCode') productCode: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return await this.productsService.update(productCode, updateProductDto);
    }

    @Delete()
    @Roles(Role.Admin)
    async remove(@Query('productCode') productCode: string) {
        return await this.productsService.delete(productCode);
    }
}