import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  createSlot(@Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.createSlot(createSlotDto);
  }

  @Put(':id')
  updateSlot(
    @Param('id') id: string,
    @Body() updateSlotDto: UpdateSlotDto,
  ) {
    return this.slotsService.updateSlot(id, updateSlotDto);
  }
}
