import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ProductsService } from './products.service';
import { Product } from './product.entity';

describe('ProductsService', () => {
    let productService: ProductsService;

    const mockRepository = {
        findOneBy: jest.fn(),
        create: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        productService = module.get<ProductsService>(ProductsService);
    });

    it('should be defined', () => {
        expect(productService).toBeDefined();
    });

    describe('create', () => {
        beforeEach(() => {
            mockRepository.create.mockClear();
            mockRepository.insert.mockClear();
            mockRepository.findOneBy.mockClear();
        });

        it('should create a new product', async () => {
            const mockProduct = {
                productCode: '1001',
                location: 'West Malaysia',
                price: 300,
            } as Product;

            const newProduct = {
                id: 1,
                ...mockProduct,
            };

            jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(null);
            const createSpy = jest.spyOn(mockRepository, 'create').mockReturnValue(newProduct);
            const insertSpy = jest.spyOn(mockRepository, 'insert');

            const mockCreatedProduct = await mockRepository.create(mockProduct);
            await mockRepository.insert(newProduct);

            expect(mockCreatedProduct).toEqual(newProduct);

            expect(createSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).toHaveBeenCalledWith(mockProduct);

            expect(insertSpy).toHaveBeenCalledTimes(1);
            expect(insertSpy).toHaveBeenCalledWith(newProduct);
        });

        it('should throw a bad request exception if product is duplicated', async () => {
            const duplicatedProduct = {
                productCode: '1001',
                location: 'West Malaysia',
                price: 300,
            };

            jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(duplicatedProduct);

            await expect(productService.create(duplicatedProduct)).rejects.toThrow(
                new BadRequestException('Product already exists!'),
            );

            expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(mockRepository.findOneBy).toHaveBeenCalledWith({
                productCode: duplicatedProduct.productCode,
            });

            expect(mockRepository.create).not.toHaveBeenCalled();

            expect(mockRepository.insert).not.toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        beforeEach(() => {
            mockRepository.findOneBy.mockClear();
        });

        it('should return a product with the provided productCode and location', async () => {
            const productCode = '1001';
            const location = 'West Malaysia';

            const mockProduct = {
                id: 1,
                productCode,
                location,
                price: 300,
            } as Product;

            const findOneBySpy = jest
                .spyOn(mockRepository, 'findOneBy')
                .mockReturnValue(mockProduct);

            expect(mockRepository.findOneBy({ productCode, location })).toEqual(mockProduct);

            expect(findOneBySpy).toHaveBeenCalledTimes(1);
            expect(findOneBySpy).toHaveBeenCalledWith({
                productCode,
                location,
            });
        });

        it('should throw not found exception if product is not found', async () => {
            const productCode = '1001';
            const location = 'West Malaysia';

            const findOneBySpy = jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(null);

            await expect(productService.findOne({ productCode, location })).rejects.toThrow(
                new NotFoundException('Product information not found!'),
            );

            expect(findOneBySpy).toHaveBeenCalledTimes(1);
            expect(findOneBySpy).toHaveBeenCalledWith({
                productCode,
                location,
            });
        });
    });

    describe('update', () => {
        beforeEach(() => {
            mockRepository.update.mockClear();
            mockRepository.findOneBy.mockClear();
        });

        it('should update the product', async () => {
            const productCode = '1001';

            const mockProduct = {
                id: 1,
                productCode,
                location: 'West Malaysia',
                price: 300,
            } as Product;

            const updateProductDto = {
                location: 'West Malaysia',
                price: 300,
            };

            const productResult = {
                affected: 1,
            };

            const updateSpy = jest.spyOn(mockRepository, 'update').mockReturnValue(productResult);

            const findOneBySpy = jest
                .spyOn(mockRepository, 'findOneBy')
                .mockReturnValue(mockProduct);

            expect(mockRepository.update({ productCode }, updateProductDto)).toEqual(productResult);
            expect(mockRepository.findOneBy({ productCode })).toEqual(mockProduct);

            expect(updateSpy).toHaveBeenCalledTimes(1);
            expect(updateSpy).toHaveBeenCalledWith({ productCode }, updateProductDto);

            expect(findOneBySpy).toHaveBeenCalledTimes(1);
            expect(findOneBySpy).toHaveBeenCalledWith({ productCode });
        });

        it('should throw not found exception if no product has been updated', async () => {
            const productCode = '1001';

            const updateProductDto = {
                location: 'West Malaysia',
                price: 300,
            };

            const productResult = {
                affected: 0,
            };

            const updateSpy = jest.spyOn(mockRepository, 'update').mockReturnValue(productResult);
            const findOneBySpy = jest.spyOn(mockRepository, 'findOneBy');

            expect(mockRepository.update({ productCode }, updateProductDto)).toEqual(productResult);

            expect(updateSpy).toHaveBeenCalledTimes(1);
            expect(updateSpy).toHaveBeenCalledWith({ productCode }, updateProductDto);

            expect(findOneBySpy).toHaveBeenCalledTimes(0);
        });
    });
});
