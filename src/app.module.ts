import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';

import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';

import { AuthGuard } from './common/guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CatchEverythingFilter } from './exception-filters/catch-all-exception.filter';

@Module({
    imports: [
        CacheModule.register({
            ttl: 10000,
            isGlobal: true,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USER'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                entities: [Product],
                synchronize: true,
            }),
        }),
        ProductsModule,
        AuthModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_FILTER,
            useClass: CatchEverythingFilter,
        },
    ],
})
export class AppModule { }
