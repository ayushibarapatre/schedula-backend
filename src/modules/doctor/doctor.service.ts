// src/modules/doctor/doctor.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  // ✅ CREATE doctor profile (REAL DB SAVE)
  async createDoctorProfile(userId: string) {
    // 1️⃣ check already exists
    const existing = await this.doctorRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (existing) {
      return {
        message: 'Doctor profile already exists',
        doctorId: existing.id,
      };
    }

    // 2️⃣ create & save
    const doctor = this.doctorRepository.create({
      user: { id: userId },
    });

    await this.doctorRepository.save(doctor);

    return {
      message: 'Doctor profile created successfully',
      doctorId: doctor.id,
    };
  }

  // ✅ GET doctor profile
  async getDoctorProfile(userId: string) {
    return this.doctorRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}