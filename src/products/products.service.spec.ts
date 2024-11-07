import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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
            const mockProduct = {
                productCode: '1001',
                location: 'West Malaysia',
                price: 300,
            } as Product;

            const findOneBySpy = jest
                .spyOn(mockRepository, 'findOneBy')
                .mockReturnValue(mockProduct);

            const productCode = '1001';
            const location = 'West Malaysia';

            const result = await productService.findOne({ productCode, location });

            expect(findOneBySpy).toHaveBeenCalledTimes(1);
            expect(findOneBySpy).toHaveBeenCalledWith({
                productCode,
                location,
            });

            expect(result).toEqual(mockProduct);
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
});
