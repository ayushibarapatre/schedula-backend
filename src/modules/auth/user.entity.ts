import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  role: string;

  // User ↔ Doctor (One-to-One)
  @OneToOne(() => Doctor, doctor => doctor.user)
  doctor: Doctor;
}
