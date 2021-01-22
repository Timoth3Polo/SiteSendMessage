import { IsDefined, Length } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Enterprise } from "./Enterprise";

import { Message } from "./Message";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Length(2, 20, { message: "Le nom doit faire entre 2 et 20 charactères" })
  nom: string;

  @Column()
  @IsDefined({ message: "Requis" })
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

  @OneToMany(() => Message, (message) => message.user)
  sendMessages: [Message];

  @OneToMany(() => Message, (message) => message.destinataire)
  receiveMessage: [Message];

  @ManyToMany(() => Enterprise )
  @JoinTable()
  enterprise: [Enterprise]
}
