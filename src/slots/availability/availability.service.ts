import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Availability,
  AvailabilityType,
  SchedulingType,
} from './availability.entity';
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

  // 🔹 CREATE AVAILABILITY (Recurring / Custom)
  async addAvailability(
    userId: string,
    dto: CreateAvailabilityDto,
  ) {
    // 1️⃣ Find doctor
    const doctor = await this.doctorRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // 2️⃣ Time validation
    const start = this.timeToMinutes(dto.startTime);
    const end = this.timeToMinutes(dto.endTime);

    if (start >= end) {
      throw new BadRequestException(
        'End time must be greater than start time',
      );
    }

    // 3️⃣ Scheduling validation (WAVE)
    if (dto.schedulingType === SchedulingType.WAVE) {
      if (
        !dto.slotDuration ||
        !dto.maxPatientsPerSlot
      ) {
        throw new BadRequestException(
          'slotDuration and maxPatientsPerSlot are required for WAVE scheduling',
        );
      }
    }

    // 4️⃣ CUSTOM availability → override existing custom
    if (dto.availabilityType === AvailabilityType.CUSTOM) {
      if (!dto.date) {
        throw new BadRequestException(
          'date is required for CUSTOM availability',
        );
      }

      const existingCustom =
        await this.availabilityRepository.findOne({
          where: {
            doctor: { id: doctor.id },
            availabilityType:
              AvailabilityType.CUSTOM,
            date: dto.date,
          },
        });

      if (existingCustom) {
        await this.availabilityRepository.remove(
          existingCustom,
        );
      }
    }

    // 5️⃣ Prevent duplicate RECURRING availability
    if (
      dto.availabilityType ===
      AvailabilityType.RECURRING
    ) {
      const existingRecurring =
        await this.availabilityRepository.findOne({
          where: {
            doctor: { id: doctor.id },
            availabilityType:
              AvailabilityType.RECURRING,
            day: dto.day,
            startTime: dto.startTime,
            endTime: dto.endTime,
          },
        });

      if (existingRecurring) {
        throw new BadRequestException(
          'Recurring availability already exists for this day and time',
        );
      }
    }

    // 6️⃣ Save availability
    const availability =
      this.availabilityRepository.create({
        ...dto,
        doctor,
      });

    return this.availabilityRepository.save(
      availability,
    );
  }

  // 🔹 DELETE AVAILABILITY
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

  // 🔹 GET AVAILABILITY FOR A SPECIFIC DATE
  async getAvailabilityForDate(
    doctorId: number,
    date: string, // YYYY-MM-DD
  ) {
    // 1️⃣ Check CUSTOM availability first
    const customAvailability =
      await this.availabilityRepository.findOne({
        where: {
          doctor: { id: doctorId },
          availabilityType:
            AvailabilityType.CUSTOM,
          date: date,
          isActive: true,
        },
      });

    if (customAvailability) {
      return {
        source: 'CUSTOM',
        availability: customAvailability,
      };
    }

    // 2️⃣ Get day from date
    const dayOfWeek = new Date(date)
      .toLocaleDateString('en-US', {
        weekday: 'long',
      })
      .toUpperCase();

    // 3️⃣ Check RECURRING availability
    const recurringAvailability =
      await this.availabilityRepository.findOne({
        where: {
          doctor: { id: doctorId },
          availabilityType:
            AvailabilityType.RECURRING,
          day: dayOfWeek as any,
          isActive: true,
        },
      });

    if (recurringAvailability) {
      return {
        source: 'RECURRING',
        availability: recurringAvailability,
      };
    }

    // 4️⃣ No availability
    throw new NotFoundException(
      'Doctor is not available on this date',
    );
  }
}
