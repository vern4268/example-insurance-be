import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

describe('ProductsController', () => {
    let productsController: ProductsController;

    const mockJwtService = {};

    const mockProductsService = {
        create: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ProductsService,
                    useValue: mockProductsService,
                },
            ],
        }).compile();

        productsController = module.get<ProductsController>(ProductsController);
    });

    it('should be defined', () => {
        expect(productsController).toBeDefined();
    });

    describe('create', () => {
        beforeEach(() => {
            mockProductsService.create.mockClear();
        });

        it('should return the created product if productCode, location and price are supplied', async () => {
            const createProductBody = {
                productCode: '1001',
                location: 'West Malaysia',
                price: 300,
            };

            const product = {
                id: 1,
                productCode: '1001',
                location: 'West Malaysia',
                price: 300,
            } as Product;

            jest.spyOn(mockProductsService, 'create').mockReturnValue(product);

            await expect(productsController.create(createProductBody)).resolves.toBe(product);

            expect(mockProductsService.create).toHaveBeenCalledTimes(1);
            expect(mockProductsService.create).toHaveBeenCalledWith(createProductBody);
        });

        it('should throw a bad request exception if product already exists', async () => {
            const createProductBody = {
                productCode: '1001',
                location: 'West Malaysia',
                price: 300,
            };

            jest.spyOn(mockProductsService, 'create').mockRejectedValue(
                new BadRequestException('Product already exists!'),
            );

            await expect(productsController.create(createProductBody)).rejects.toThrow(
                new BadRequestException('Product already exists!'),
            );

            expect(mockProductsService.create).toHaveBeenCalledTimes(1);
            expect(mockProductsService.create).toHaveBeenCalledWith(createProductBody);
        });
    });

    describe('findOne', () => {
        beforeEach(() => {
            mockProductsService.findOne.mockClear();
        });

        it('should return a product if productCode and location are supplied', async () => {
            const productCode = '1001';
            const location = 'West Malaysia';

            const findProductDto = {
                productCode,
                location,
            };

            const product = {
                id: 1,
                productCode: '1001',
                location: 'West Malaysia',
                price: 300,
            } as Product;

            jest.spyOn(mockProductsService, 'findOne').mockReturnValue(product);

            await expect(productsController.findOne(findProductDto)).resolves.toBe(product);

            expect(mockProductsService.findOne).toHaveBeenCalledTimes(1);
            expect(mockProductsService.findOne).toHaveBeenCalledWith(findProductDto);
        });

        it('should throw a not found exception if product does not exist', async () => {
            const productCode = '1001';
            const location = 'West Malaysia';

            const findProductDto = {
                productCode,
                location,
            };

            jest.spyOn(mockProductsService, 'findOne').mockRejectedValue(
                new NotFoundException('Product information not found!'),
            );

            await expect(productsController.findOne(findProductDto)).rejects.toThrow(
                new NotFoundException('Product information not found!'),
            );

            expect(mockProductsService.findOne).toHaveBeenCalledTimes(1);
            expect(mockProductsService.findOne).toHaveBeenCalledWith(findProductDto);
        });
    });

    describe('update', () => {
        beforeEach(() => {
            mockProductsService.update.mockClear();
        });

        it('should return the updated product if product exists', async () => {
            const productCode = '1002';
            const location = 'West Malaysia';
            const price = 400;

            const updateProductDto = {
                productCode,
                location,
                price,
            };

            const product = {
                id: 1,
                productCode,
                location,
                price,
            } as Product;

            jest.spyOn(mockProductsService, 'update').mockReturnValue(product);

            await expect(productsController.update(productCode, updateProductDto)).resolves.toBe(
                product,
            );

            expect(mockProductsService.update).toHaveBeenCalledTimes(1);
            expect(mockProductsService.update).toHaveBeenCalledWith(productCode, updateProductDto);
        });

        it('should resolve to false if product does not exist', async () => {
            const productCode = '1002';
            const location = 'West Malaysia';
            const price = 400;

            const updateProductDto = {
                productCode,
                location,
                price,
            };

            jest.spyOn(mockProductsService, 'update').mockRejectedValue(false);

            await expect(productsController.update(productCode, updateProductDto)).rejects.toBe(
                false,
            );

            expect(mockProductsService.update).toHaveBeenCalledTimes(1);
            expect(mockProductsService.update).toHaveBeenCalledWith(productCode, updateProductDto);
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            mockProductsService.delete.mockClear();
        });

        it('should resolve to true if product is deleted successfully', async () => {
            const productCode = '1001';

            jest.spyOn(mockProductsService, 'delete').mockReturnValue(true);

            await expect(productsController.delete(productCode)).resolves.toBe(true);

            expect(mockProductsService.delete).toHaveBeenCalledTimes(1);
            expect(mockProductsService.delete).toHaveBeenCalledWith(productCode);
        });

        it('should resolve to false if product does not exist', async () => {
            const productCode = '1001';

            jest.spyOn(mockProductsService, 'delete').mockRejectedValue(false);

            await expect(productsController.delete(productCode)).rejects.toBe(false);

            expect(mockProductsService.delete).toHaveBeenCalledTimes(1);
            expect(mockProductsService.delete).toHaveBeenCalledWith(productCode);
        });
    });
});
