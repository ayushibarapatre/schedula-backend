import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Availability } from './availability.entity';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { Doctor } from '../../modules/doctor/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Availability,
      Doctor, // ✅ VERY IMPORTANT
    ]),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
