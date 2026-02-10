import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('minimum_wages')
export class WageEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  salary!: number;

  @Column('text', { nullable: true })
  value_to_word?: string;

  @Column({ length: 100, nullable: true })
  range?: string;

  @Column({ length: 200, nullable: true })
  law?: string;

  @Column({ type: 'date' })
  recorded_date!: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}
