// src/modules/doctor/doctor.service.ts

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 🔹 CREATE doctor profile (REAL DB)
  async createDoctorProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingDoctor =
      await this.doctorRepo.findOne({
        where: { user: { id: userId } },
      });

    if (existingDoctor) {
      throw new BadRequestException(
        'Doctor profile already exists',
      );
    }

    const doctor = this.doctorRepo.create({
      user,
    });

    return this.doctorRepo.save(doctor);
  }

  // 🔹 GET doctor profile (REAL DB)
  async getDoctorProfile(userId: string) {
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }
}