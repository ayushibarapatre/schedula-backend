import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
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

  @Post()
  createAvailability(@Req() req: any, @Body() dto: CreateAvailabilityDto) {
    const userId = req.user.sub;
    return this.availabilityService.addAvailability(userId, dto);
  }

  // ✅ NEW DELETE API
  @Delete(':id')
  deleteAvailability(@Req() req: any, @Param('id') id: number) {
    const userId = req.user.sub;
    return this.availabilityService.deleteAvailability(userId, id);
  }
}
