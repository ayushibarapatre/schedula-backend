// src/modules/availability/availability.controller.ts

import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('availability')
@UseGuards(AuthGuard('jwt'))
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  // ✅ CREATE availability (CUSTOM / RECURRING / STREAM)
  @Post()
  createAvailability(
    @Req() req: any,
    @Body() dto: CreateAvailabilityDto,
  ) {
    const userId = req.user.sub;
    return this.availabilityService.addAvailability(
      userId,
      dto,
    );
  }

  // ✅ GET availability by doctorId + date
  @Get()
  getAvailabilityForDate(
    @Query('doctorId') doctorId: number,
    @Query('date') date: string,
  ) {
    return this.availabilityService.getAvailabilityForDate(
      Number(doctorId),
      date,
    );
  }

  // ✅ DELETE availability by id  ⭐ (NEW)
@Delete(':id')
deleteAvailability(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.availabilityService.deleteAvailability(
    req.user.sub,   // ✅ userId (string) FIRST
    Number(id),     // ✅ availabilityId (number) SECOND
  );
}
}