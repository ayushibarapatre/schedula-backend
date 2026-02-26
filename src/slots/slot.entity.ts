import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Availability } from './availability/availability.entity';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Availability, { onDelete: 'CASCADE' })
  availability: Availability;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  maxPatients: number;

  @Column({ default: 0 })
  bookedCount: number;

  @Column({ default: true })
  isActive: boolean;
}
