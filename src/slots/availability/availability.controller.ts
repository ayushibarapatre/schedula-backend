import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
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
    // ✅ JWT payload me user id = sub
    const userId = req.user.sub;

    return this.availabilityService.addAvailability(
      userId,
      dto,
    );
  }
}
