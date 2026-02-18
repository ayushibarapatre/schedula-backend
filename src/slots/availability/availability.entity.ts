import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Doctor } from '../../modules/doctor/doctor.entity';

/**
 * 🔹 Recurring availability ke liye
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
 * RECURRING → har week repeat hoti hai
 * CUSTOM → specific date ke liye
 */
export enum AvailabilityType {
  RECURRING = 'RECURRING',
  CUSTOM = 'CUSTOM',
}

/**
 * 🔹 Scheduling Type
 * WAVE → slots + duration
 * STREAM → continuous time window
 */
export enum SchedulingType {
  WAVE = 'WAVE',
  STREAM = 'STREAM',
}

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 🔹 Day of week (ONLY for recurring availability)
   */
  @Column({ type: 'text', nullable: true })
  day: Day;

  /**
   * 🔹 Specific date (ONLY for custom availability)
   * Format: YYYY-MM-DD
   */
  @Column({ type: 'date', nullable: true })
  date: string;

  /**
   * 🔹 RECURRING / CUSTOM
   */
  @Column({
    type: 'text',
    default: AvailabilityType.RECURRING,
  })
  availabilityType: AvailabilityType;

  /**
   * 🔹 WAVE / STREAM
   */
  @Column({
    type: 'text',
    default: SchedulingType.WAVE,
  })
  schedulingType: SchedulingType;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  /**
   * 🔹 Slot duration (ONLY for WAVE scheduling)
   */
  @Column({ nullable: true })
  slotDuration: number;

  /**
   * 🔹 Max patients per slot (ONLY for WAVE)
   */
  @Column({ nullable: true })
  maxPatientsPerSlot: number;

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
