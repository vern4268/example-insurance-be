import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

describe('ProductsController', () => {
    let productsController: ProductsController;
    let productsService: ProductsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [ProductsService],
        }).compile();

        productsController = module.get<ProductsController>(ProductsController);
        productsService = module.get<ProductsService>(ProductsService);
    });

    // describe('create', () => {
    //     it('should return the created product if product is new', async () => {
    //         const createProductBody = {
    //             productCode: '1001',
    //             location: 'West Malaysia',
    //             price: 500,
    //         };

    //         const product = {
    //             id: 1,
    //             productCode: '1001',
    //             location: 'West Malaysia',
    //             price: 500,
    //         } as Product;

    //         jest.spyOn(productsService, 'create').mockReturnValue(product);

    //         expect(await productsController.findAll()).toBe(result);
    //     });
    // });
});
