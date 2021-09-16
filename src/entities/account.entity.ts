import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { E } from '@common';

@Entity('Accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: E.AccountProviderEnum })
  provider: E.AccountProviderEnum;

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

  @Column({ default: '' })
  username: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
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
