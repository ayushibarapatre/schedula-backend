import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Doctor } from '../../modules/doctor/doctor.entity';

/**
 * 🔹 Day of week (for recurring availability)
 */
export enum Day {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

/**
 * 🔹 Availability Type
 */
export enum AvailabilityType {
  RECURRING = 'RECURRING',
  CUSTOM = 'CUSTOM',
}

/**
 * 🔹 Scheduling Type
 */
export enum SchedulingType {
  WAVE = 'WAVE',
  STREAM = 'STREAM',
}

/**
 * 🔹 Time of Day (mentor feedback)
 */
export enum TimeOfDay {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
}

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔹 Only for RECURRING
  @Column({ type: 'text', nullable: true })
  day?: Day;

  // 🔹 Only for CUSTOM (YYYY-MM-DD)
  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({
    type: 'text',
    default: AvailabilityType.RECURRING,
  })
  availabilityType: AvailabilityType;

  @Column({
    type: 'text',
    default: SchedulingType.WAVE,
  })
  schedulingType: SchedulingType;

  // 🔹 MORNING / EVENING (NEW – feedback based)
  @Column({
    type: 'text',
    nullable: true,
  })
  timeOfDay?: TimeOfDay;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  // 🔹 WAVE only
  @Column({ nullable: true })
  slotDuration?: number;

  @Column({ nullable: true })
  maxPatientsPerSlot?: number;

  // 🔹 STREAM only (one big slot)
  @Column({ nullable: true })
  maxCapacity?: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(
    () => Doctor,
    doctor => doctor.availabilities,
    {
      onDelete: 'CASCADE',
    },
  )
  doctor: Doctor;
}
