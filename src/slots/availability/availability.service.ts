import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Availability } from './availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { Doctor } from '../../modules/doctor/doctor.entity';
@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  // 🔹 helper: HH:mm → minutes
  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  // 🔹 CREATE AVAILABILITY
  async addAvailability(
    userId: string,
    dto: CreateAvailabilityDto,
  ) {
    const doctor = await this.doctorRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const start = this.timeToMinutes(dto.startTime);
    const end = this.timeToMinutes(dto.endTime);

    if (start >= end) {
      throw new BadRequestException(
        'End time must be greater than start time',
      );
    }

    const existing = await this.availabilityRepository.findOne({
      where: {
        doctor: { id: doctor.id },
        day: dto.day,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Availability already exists for this day and time',
      );
    }

    const availability = this.availabilityRepository.create({
      ...dto,
      doctor,
    });

    return this.availabilityRepository.save(availability);
  }

  // 🔹 DELETE AVAILABILITY ✅
  async deleteAvailability(
    userId: string,
    availabilityId: number,
  ) {
    const doctor = await this.doctorRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const availability =
      await this.availabilityRepository.findOne({
        where: {
          id: availabilityId,
          doctor: { id: doctor.id },
        },
      });

    if (!availability) {
      throw new NotFoundException(
        'Availability not found',
      );
    }

    await this.availabilityRepository.remove(
      availability,
    );

    return {
      message: 'Availability deleted successfully',
    };
  }
}
