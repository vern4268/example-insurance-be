import { Controller, Get, Post, Body, Delete, Query, Put, Inject } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindOneDto } from './dto/find-one-product.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enum/role.enum';

@Controller('products')
@ApiBearerAuth()
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @Post()
    @Roles(Role.Admin)
    async create(@Body() createProductDto: CreateProductDto) {
        return await this.productsService.create(createProductDto);
    }

    @Get()
    @Roles(Role.Admin, Role.User)
    async findOne(@Query() findOneDto: FindOneDto) {
        const cacheKey = `product_${findOneDto.productCode}_${findOneDto.location}`;

        const cachedValue = await this.cacheManager.get<string>(cacheKey);

        if (cachedValue) return cachedValue;

        const product = await this.productsService.findOne(findOneDto);

        await this.cacheManager.set(cacheKey, product);

        return product;
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
    async delete(@Query('productCode') productCode: string) {
        return await this.productsService.delete(productCode);
    }
}
