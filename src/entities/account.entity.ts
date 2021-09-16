import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { E } from '@common';

@Entity('Accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  provider: string;

  @Column({ default: '' })
  providerId: string;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column('text')
  profilePicture: string;

  @Column({ type: 'enum', enum: E.GenderEnum })
  gender: E.GenderEnum;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: '' })
  password: string;

  @Column({ type: 'enum', enum: E.AccountTypeEnum })
  type: E.AccountTypeEnum;

  @Column({ type: 'enum', enum: E.StatusEnum, default: E.StatusEnum.inactive })
  status: E.StatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
