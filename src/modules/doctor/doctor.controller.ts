import {
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoctorService } from './doctor.service';

@Controller('doctor')
@UseGuards(AuthGuard('jwt'))
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
  ) {}

  @Post('profile')
  createProfile(@Req() req: any) {
    // ✅ JWT payload me user id = sub
    const userId = req.user.sub;

    return this.doctorService.createDoctorProfile(
      userId,
    );
  }
}
