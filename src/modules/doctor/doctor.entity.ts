import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Availability } from '../../slots/availability/availability.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(
    () => Availability,
    availability => availability.doctor,
  )
  availabilities: Availability[];
}
