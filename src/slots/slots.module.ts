import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { Slot } from './slot.entity';
import { Availability } from './availability/availability.entity';
import { Appointment } from '../appointment/appointment.entity'; // ✅ ADD THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Slot,
      Availability,
      Appointment, // ✅ VERY IMPORTANT FIX
    ]),
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}