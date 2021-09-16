import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Setting')
export class SettingEntity {
  @PrimaryColumn()
  key: string;

  @Column('text')
  value: string;
}
