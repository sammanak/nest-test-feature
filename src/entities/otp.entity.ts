import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { E } from '@common';
import { AccountEntity } from '@entities';

@Entity('AccountOtp')
export class AccountOtpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity, account => account.id)
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;

  @Column({ type: 'integer' })
  accountId: number;

  @Column()
  code: string;

  @Column()
  value: string;

  @Column({ type: 'enum', enum: E.OtpVerifyTypeEnum })
  type: E.OtpVerifyTypeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  expiredAt: Date;
}
