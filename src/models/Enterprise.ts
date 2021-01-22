import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Enterprise extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    name: string
}