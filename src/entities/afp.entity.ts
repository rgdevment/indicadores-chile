import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('afp_commissions')
export class AfpEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;

  @Column({ length: 100 })
  category!: string;

  @Column({ length: 100, nullable: true })
  sub_category?: string;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  commission?: number;

  @Column({ type: 'date' })
  recorded_date!: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}
