import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Slot } from '../slots/slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Slot, // ✅ IMPORTANT FIX
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}