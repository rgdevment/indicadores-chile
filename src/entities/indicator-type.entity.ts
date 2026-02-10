import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IndicatorSubtypeEntity } from './indicator-subtype.entity';

@Entity('indicator_types')
export class IndicatorTypeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  code!: string;

  @Column({ length: 100 })
  name!: string;

  @OneToMany(() => IndicatorSubtypeEntity, subtype => subtype.type)
  subtypes!: IndicatorSubtypeEntity[];
}
