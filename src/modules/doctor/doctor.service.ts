import { Injectable, BadRequestException } from '@nestjs/common';
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

  async createDoctorProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const existing = await this.doctorRepo.findOne({
      where: { user: { id: userId } },
    });

    if (existing) {
      return existing; // already created
    }

    const doctor = this.doctorRepo.create({ user });
    return this.doctorRepo.save(doctor);
  }
}
