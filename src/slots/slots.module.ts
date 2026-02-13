import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './slot.entity';
import { Availability } from './availability/availability.entity';
import { AvailabilityModule } from './availability/availability.module';

import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';

@Module({
 imports: [
  TypeOrmModule.forFeature([Slot, Availability]),
  AvailabilityModule, 
],

  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [TypeOrmModule],
})
export class SlotsModule {}
