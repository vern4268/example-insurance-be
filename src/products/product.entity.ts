import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productCode: string;

    @Column()
    location: string;

    @Column()
    price: number;
}
