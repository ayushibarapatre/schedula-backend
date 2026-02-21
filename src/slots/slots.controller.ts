import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SlotsService } from './slots.service';

@UseGuards(AuthGuard('jwt'))
@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  // Generate slots
  @Post('generate/:availabilityId')
  generate(
    @Param('availabilityId', ParseIntPipe) id: number,
  ) {
    return this.slotsService.generateSlots(id);
  }

  // ✅ NEW: Get slots by doctor + date (PATIENT SIDE)
  @Get('doctor/:doctorId')
  getSlotsByDoctorAndDate(
    @Param('doctorId', ParseIntPipe) doctorId: number,
    @Query('date') date: string,
  ) {
    return this.slotsService.getSlotsByDoctorAndDate(
      doctorId,
      date,
    );
  }
}