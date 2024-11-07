import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindOneDto } from './dto/find-one-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto) {
        const isDuplicated = await this.productsRepository.findOneBy({
            productCode: createProductDto.productCode,
        });

        if (isDuplicated) {
            throw new BadRequestException('Product already exists!');
        }

        const createdProduct = this.productsRepository.create(createProductDto);
        await this.productsRepository.insert(createdProduct);

        return createdProduct;
    }

    async findOne(findOneDto: FindOneDto) {
        const product = await this.productsRepository.findOneBy(findOneDto);

        if (!product) {
            throw new NotFoundException('Product information not found!');
        }

        return product;
    }

    async update(productCode: string, updateProductDto: UpdateProductDto) {
        const updateResult = await this.productsRepository.update(
            { productCode },
            updateProductDto,
        );

        if (updateResult.affected === 0) {
            throw new NotFoundException('Unable to update product!');
        }

        return await this.productsRepository.findOneBy({ productCode });
    }

    async delete(productCode: string) {
        const deleteResult = await this.productsRepository.delete({ productCode });

        if (deleteResult.affected === 0) {
            throw new NotFoundException('Unable to delete product!');
        }

        return true;
    }
}
