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

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔹 Doctor (UUID from User)
  @Column()
  doctorId: string;

  // 🔹 Patient (UUID from User)
  @Column()
  patientId: string;

  // 🔹 Slot reference (IMPORTANT)
  @Column()
  slotId: number;

  // 🔹 Derived from Slot (for record/history)
  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({
    type: 'text',
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;

  // 🔹 For reschedule tracking
  @Column({ nullable: true })
  rescheduledFrom?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  cancelledAt?: Date;
}