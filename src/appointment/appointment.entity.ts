import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum AppointmentStatus {
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export enum ScheduleType {
  STREAM = 'STREAM',
  WAVE = 'WAVE',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  doctorId: string;

  @Column()
  patientId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({
    type: 'text',
  })
  scheduleType: ScheduleType;

  @Column({
    type: 'text',
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;

  // 🔹 For reschedule tracking (old appointment id)
  @Column({ nullable: true })
  rescheduledFrom?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  cancelledAt?: Date;
}