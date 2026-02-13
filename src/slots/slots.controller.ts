import { Controller, Post, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SlotsService } from './slots.service';

@UseGuards(AuthGuard('jwt'))
@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post('generate/:availabilityId')
  generate(
    @Param('availabilityId', ParseIntPipe) id: number,
  ) {
    return this.slotsService.generateSlots(id);
  }
}
