import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

describe('ProductsController', () => {
    let productsController: ProductsController;
    let cache: Cache;

    const mockJwtService = {};

    const mockProductsService = {
        create: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockCacheManager = {
        get: () => jest.fn(),
        set: () => jest.fn(),
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
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();

        productsController = module.get<ProductsController>(ProductsController);
        cache = module.get(CACHE_MANAGER);
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

            const createSpy = jest.spyOn(mockProductsService, 'create').mockReturnValue(product);

            await expect(productsController.create(createProductBody)).resolves.toEqual(product);

            expect(createSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).toHaveBeenCalledWith(createProductBody);
        });

        it('should throw a bad request exception if product already exists', async () => {
            const createProductBody = {
                productCode: '1001',
                location: 'West Malaysia',
                price: 300,
            };

            const createSpy = jest
                .spyOn(mockProductsService, 'create')
                .mockRejectedValue(new BadRequestException('Product already exists!'));

            await expect(productsController.create(createProductBody)).rejects.toThrow(
                new BadRequestException('Product already exists!'),
            );

            expect(createSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).toHaveBeenCalledWith(createProductBody);
        });
    });

    describe('findOne', () => {
        beforeEach(() => {
            mockProductsService.findOne.mockClear();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should cache the product', async () => {
            const productCode = '1001';
            const location = 'West Malaysia';
            const cacheKey = `product_${productCode}_${location}`;

            const product = {
                id: 1,
                productCode: '1001',
                location: 'West Malaysia',
                price: 300,
            } as Product;

            const spy = jest.spyOn(cache, 'set');

            await cache.set(cacheKey, product);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0][0]).toEqual(cacheKey);
            expect(spy.mock.calls[0][1]).toEqual(product);
        });

        it('should return the product from cache if productCode and location are supplied', async () => {
            const productCode = '1001';
            const location = 'West Malaysia';

            const product = {
                id: 1,
                productCode: '1001',
                location: 'West Malaysia',
                price: 300,
            } as Product;

            jest.spyOn(cache, 'get').mockResolvedValue(product);

            const res = await productsController.findOne({
                productCode,
                location,
            });

            expect(res).toEqual(product);
        });

        it('should return a product from service if productCode and location are supplied', async () => {
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

            jest.spyOn(cache, 'get').mockReturnValue(null);
            const findOneSpy = jest.spyOn(mockProductsService, 'findOne').mockReturnValue(product);

            await expect(productsController.findOne(findProductDto)).resolves.toEqual(product);

            expect(findOneSpy).toHaveBeenCalledTimes(1);
            expect(findOneSpy).toHaveBeenCalledWith(findProductDto);
        });

        it('should throw a not found exception if product does not exist', async () => {
            const productCode = '1001';
            const location = 'West Malaysia';

            const findProductDto = {
                productCode,
                location,
            };

            jest.spyOn(cache, 'get').mockReturnValue(null);
            const findOneSpy = jest
                .spyOn(mockProductsService, 'findOne')
                .mockRejectedValue(new NotFoundException('Product information not found!'));

            await expect(productsController.findOne(findProductDto)).rejects.toThrow(
                new NotFoundException('Product information not found!'),
            );

            expect(findOneSpy).toHaveBeenCalledTimes(1);
            expect(findOneSpy).toHaveBeenCalledWith(findProductDto);
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

            const updateSpy = jest.spyOn(mockProductsService, 'update').mockReturnValue(product);

            await expect(productsController.update(productCode, updateProductDto)).resolves.toEqual(
                product,
            );

            expect(updateSpy).toHaveBeenCalledTimes(1);
            expect(updateSpy).toHaveBeenCalledWith(productCode, updateProductDto);
        });

        it('should throw not found exception if product does not exist', async () => {
            const productCode = '1002';
            const location = 'West Malaysia';
            const price = 400;

            const updateProductDto = {
                productCode,
                location,
                price,
            };

            const updateSpy = jest
                .spyOn(mockProductsService, 'update')
                .mockRejectedValue(new NotFoundException('Unable to update product!'));

            await expect(productsController.update(productCode, updateProductDto)).rejects.toThrow(
                new NotFoundException('Unable to update product!'),
            );

            expect(updateSpy).toHaveBeenCalledTimes(1);
            expect(updateSpy).toHaveBeenCalledWith(productCode, updateProductDto);
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            mockProductsService.delete.mockClear();
        });

        it('should resolve to true if product is deleted successfully', async () => {
            const productCode = '1001';

            const deleteSpy = jest.spyOn(mockProductsService, 'delete').mockReturnValue(true);

            await expect(productsController.delete(productCode)).resolves.toBe(true);

            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(deleteSpy).toHaveBeenCalledWith(productCode);
        });

        it('should throw not found exception if product does not exist', async () => {
            const productCode = '1001';

            const deleteSpy = jest
                .spyOn(mockProductsService, 'delete')
                .mockRejectedValue(new NotFoundException('Unable to delete product!'));

            await expect(productsController.delete(productCode)).rejects.toThrow(
                new NotFoundException('Unable to delete product!'),
            );

            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(deleteSpy).toHaveBeenCalledWith(productCode);
        });
    });
});
