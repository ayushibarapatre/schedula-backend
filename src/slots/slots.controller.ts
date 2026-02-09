import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Controller('slots') // 🔥 THIS IS IMPORTANT
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  createSlot(@Body() body: CreateSlotDto) {
    return this.slotsService.createSlot(body);
  }

  // ✅ THIS WAS MISSING
  @Get()
  getSlotsByDoctor(@Query('doctorId') doctorId: string) {
    return this.slotsService.getSlotsByDoctor(doctorId);
  }

  @Put(':id')
  updateSlot(
    @Param('id') id: string,
    @Body() body: UpdateSlotDto,
  ) {
    return this.slotsService.updateSlot(id, body);
  }
}
