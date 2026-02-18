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

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 🔹 Day of week (ONLY for RECURRING)
   */
  @Column({ type: 'text', nullable: true })
  day?: Day;

  /**
   * 🔹 Specific date (ONLY for CUSTOM)
   * YYYY-MM-DD
   */
  @Column({ type: 'date', nullable: true })
  date?: string;

  /**
   * 🔹 Availability type
   */
  @Column({
    type: 'text',
    default: AvailabilityType.RECURRING,
  })
  availabilityType: AvailabilityType;

  /**
   * 🔹 Scheduling type
   */
  @Column({
    type: 'text',
    default: SchedulingType.WAVE,
  })
  schedulingType: SchedulingType;

  /**
   * 🔹 Common time window
   */
  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  /**
   * 🔹 WAVE scheduling only
   */
  @Column({ nullable: true })
  slotDuration?: number;

  @Column({ nullable: true })
  maxPatientsPerSlot?: number;

  /**
   * 🔹 STREAM scheduling only
   * Total capacity for entire stream
   */
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
