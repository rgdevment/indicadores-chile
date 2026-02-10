import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IndicatorTypeEntity } from './indicator-type.entity';
import { IndicatorValueEntity } from './indicator-value.entity';

@Entity('indicator_subtypes')
@Unique(['type', 'code'])
export class IndicatorSubtypeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => IndicatorTypeEntity, type => type.subtypes, { eager: true })
  @JoinColumn({ name: 'type_id' })
  type!: IndicatorTypeEntity;

  @Column({ length: 100 })
  code!: string;

  @Column({ length: 150 })
  name!: string;

  @OneToMany(() => IndicatorValueEntity, value => value.subtype)
  values!: IndicatorValueEntity[];
}
