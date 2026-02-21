import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Slot } from './slot.entity';
import {
  Availability,
  SchedulingType,
  Day,
} from './availability/availability.entity';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,

    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
  ) {}

  // 🔹 helper: HH:mm → minutes
  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  // 🔹 helper: minutes → HH:mm
  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const m = (minutes % 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}`;
  }

  // 🔹 GENERATE SLOTS (doctor side – WAVE only)
  async generateSlots(availabilityId: number) {
    const availability =
      await this.availabilityRepository.findOne({
        where: { id: availabilityId },
      });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    if (
      availability.schedulingType ===
      SchedulingType.STREAM
    ) {
      throw new BadRequestException(
        'Slots are not generated for STREAM scheduling',
      );
    }

    const existing = await this.slotRepository.findOne({
      where: { availability: { id: availabilityId } },
    });

    if (existing) {
      throw new BadRequestException(
        'Slots already generated',
      );
    }

    const start = this.timeToMinutes(
      availability.startTime,
    );
    const end = this.timeToMinutes(
      availability.endTime,
    );
    const duration = availability.slotDuration!;

    const slots: Slot[] = [];
    let current = start;

    while (current + duration <= end) {
      slots.push(
        this.slotRepository.create({
          availability,
          startTime: this.minutesToTime(current),
          endTime: this.minutesToTime(
            current + duration,
          ),
          maxPatients:
            availability.maxPatientsPerSlot!,
          bookedCount: 0,
          isActive: true,
        }),
      );
      current += duration;
    }

    return this.slotRepository.save(slots);
  }

  // 🔹 PATIENT SIDE: GET slots by doctor + date ✅
  async getSlotsByDoctorAndDate(
    doctorId: number,
    date: string,
  ) {
    if (!date) {
      throw new BadRequestException('date is required');
    }

    // date → day (SATURDAY etc.)
    const day = new Date(date)
      .toLocaleDateString('en-US', {
        weekday: 'long',
      })
      .toUpperCase() as Day;

    // 1️⃣ find availability
    const availability =
      await this.availabilityRepository.findOne({
        where: {
          doctor: { id: doctorId },
          day,
          isActive: true,
        },
      });

    if (!availability) {
      throw new NotFoundException(
        'Doctor is not available on this date',
      );
    }

    // 2️⃣ find slots
    const slots = await this.slotRepository.find({
      where: {
        availability: { id: availability.id },
        isActive: true,
      },
    });

    if (!slots.length) {
      throw new NotFoundException(
        'No slots found for this doctor',
      );
    }

    // 3️⃣ clean response (mentor requirement)
    return slots.map(slot => ({
      slotId: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable:
        slot.bookedCount < slot.maxPatients,
    }));
  }
}