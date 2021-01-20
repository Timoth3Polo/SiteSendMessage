import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from './User';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({length: 10000, nullable: false})
  texte: string;
  @CreateDateColumn()
  dateEnvoyer: Date;
  @ManyToOne(() => User, user => user.sendMessages)
  user: User
  @ManyToOne(() => User, user => user.receiveMessage)
  destinataire: User

}
