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

  // 🔹 Generate slots from availability
  @Post('generate/:availabilityId')
  generate(
    @Param('availabilityId', ParseIntPipe)
    availabilityId: number,
  ) {
    return this.slotsService.generateSlots(
      availabilityId,
    );
  }

  // 🔹 Get ALL slots by availabilityId
  @Get('availability/:availabilityId')
  getSlotsByAvailability(
    @Param('availabilityId', ParseIntPipe)
    availabilityId: number,
  ) {
    return this.slotsService.getSlotsByAvailability(
      availabilityId,
    );
  }

  // 🔹 STEP 1: Get slots for doctor on selected date ✅
  @Get('doctor/:doctorId')
  getSlotsForDoctorByDate(
    @Param('doctorId', ParseIntPipe)
    doctorId: number,
    @Query('date')
    date: string,
  ) {
    return this.slotsService.getSlotsForDoctorByDate(
      doctorId,
      date,
    );
  }

  // 🔹 Get ONE slot by slotId
  @Get('slot/:slotId')
  getOneSlot(
    @Param('slotId', ParseIntPipe)
    slotId: number,
  ) {
    return this.slotsService.getSlotById(slotId);
  }
}