import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
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

  // 🔹 GET availability for a specific date
  @Get()
  getAvailabilityForDate(
    @Query('doctorId') doctorId: number,
    @Query('date') date: string,
  ) {
    return this.availabilityService.getAvailabilityForDate(
      doctorId,
      date,
    );
  }
}
