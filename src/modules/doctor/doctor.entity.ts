// src/modules/doctor/doctor.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Availability } from '../../slots/availability/availability.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @OneToMany(
    () => Availability,
    availability => availability.doctor,
  )
  availabilities: Availability[];

  @CreateDateColumn()
  createdAt: Date;
}