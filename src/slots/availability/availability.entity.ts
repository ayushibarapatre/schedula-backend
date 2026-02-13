import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Doctor } from '../../modules/doctor/doctor.entity';

export enum Day {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  // ✅ SQLite-compatible (string)
  @Column({ type: 'text' })
  day: Day;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  slotDuration: number;

  @Column()
  maxPatientsPerSlot: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Doctor, doctor => doctor.availabilities, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor;
}
