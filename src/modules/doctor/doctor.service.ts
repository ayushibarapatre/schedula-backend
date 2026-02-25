// src/modules/doctor/doctor.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorService {

  // 🔹 CREATE doctor profile
  async createDoctorProfile(userId: string) {
    // DB logic baad me aayega
    return {
      message: 'Doctor profile created successfully',
      userId,
    };
  }

  // 🔹 GET doctor profile
  async getDoctorProfile(userId: string) {
    // DB se profile fetch karna hoga

    return {
      userId,
    };
  }
}