import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  nom: string;
  @Column()
  prenom: string;
  @Column()
  mail: string;
  @Column()
  mdp: string;
  @Column()
  telephone: string;
  @Column()
  pseudo: string;
  @Column()
  dateDeNaissance: Date;
  @OneToMany(() => Message, message => message.user)
  sendMessages: [Message]
  @OneToMany(() => Message, message => message.destinataire)
  receiveMessage: [Message]
}
