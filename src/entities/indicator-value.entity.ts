import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IndicatorSubtypeEntity } from './indicator-subtype.entity';

@Entity('indicator_values')
@Unique(['subtype', 'recorded_date'])
export class IndicatorValueEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => IndicatorSubtypeEntity, s => s.values, { eager: true })
  @JoinColumn({ name: 'subtype_id' })
  subtype!: IndicatorSubtypeEntity;

  @Column({ type: 'decimal', precision: 20, scale: 4 })
  value!: number;

  @Column({ length: 200, nullable: true })
  value_to_word?: string;

  @Column({ length: 10, default: 'CLP' })
  unit!: string;

  @Column({ length: 200, nullable: true })
  source?: string;

  @Column({ type: 'date' })
  recorded_date!: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}
