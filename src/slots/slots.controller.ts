import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Get,
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
    @Param('availabilityId', ParseIntPipe) id: number,
  ) {
    return this.slotsService.generateSlots(id);
  }

  // 🔹 Get ALL slots by availabilityId
  @Get('availability/:availabilityId')
  getSlotsByAvailability(
    @Param('availabilityId', ParseIntPipe) availabilityId: number,
  ) {
    return this.slotsService.getSlotsByAvailability(
      availabilityId,
    );
  }

  // 🔹 Get ONE slot by slotId ✅ (THIS WAS MISSING)
  @Get('slot/:slotId')
  getOneSlot(
    @Param('slotId', ParseIntPipe) slotId: number,
  ) {
    return this.slotsService.getSlotById(slotId);
  }
}