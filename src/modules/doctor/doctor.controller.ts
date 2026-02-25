// src/doctor/doctor.controller.ts

import {
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoctorService } from './doctor.service';

@Controller('doctor')
@UseGuards(AuthGuard('jwt'))
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // 🔹 CREATE doctor profile
  @Post('profile')
  createProfile(@Req() req: any) {
    const userId = req.user.sub;
    return this.doctorService.createDoctorProfile(userId);
  }

  // 🔹 GET doctor profile
  @Get('profile')
  getProfile(@Req() req: any) {
    const userId = req.user.sub;
    return this.doctorService.getDoctorProfile(userId);
  }
}