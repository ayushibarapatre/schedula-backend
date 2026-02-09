import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  doctorId: string;

  @Column()
  dayOfWeek: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}
