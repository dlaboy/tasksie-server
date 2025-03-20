// Users Module
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // @BeforeInsert()
  // async hashPassword() {
  //   console.log("HASHING")
  //   this.password = await bcrypt.hash(this.password, 10);
  // }
}