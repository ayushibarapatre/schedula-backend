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
    return this.slotsService.generateSlots(availabilityId);
  }

  // 🔹 Get slots for doctor on selected date (PATIENT SIDE)
  @Get('doctor/:doctorId')
  getSlotsForDoctorByDate(
    @Param('doctorId', ParseIntPipe)
    doctorId: number,
    @Query('date') date: string,
  ) {
    return this.slotsService.getSlotsForDoctorByDate(
      doctorId,
      date,
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

  // 🔹 Get ONE slot by slotId
  @Get('slot/:slotId')
  getOneSlot(
    @Param('slotId', ParseIntPipe)
    slotId: number,
  ) {
    return this.slotsService.getSlotById(slotId);
  }
}