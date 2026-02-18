import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Slot } from './slot.entity';
import { Availability, SchedulingType } from './availability/availability.entity';

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
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  // 🔹 GENERATE SLOTS (ONLY FOR WAVE)
  async generateSlots(availabilityId: number) {
    const availability = await this.availabilityRepository.findOne({
      where: { id: availabilityId },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    // 🚫 STREAM → slot generation NOT allowed
    if (availability.schedulingType === SchedulingType.STREAM) {
      throw new BadRequestException(
        'Slots are not generated for STREAM scheduling',
      );
    }

    // ✅ WAVE → slotDuration MUST exist
    if (!availability.slotDuration) {
      throw new BadRequestException(
        'slotDuration is required for WAVE scheduling',
      );
    }

    const start = this.timeToMinutes(availability.startTime);
    const end = this.timeToMinutes(availability.endTime);
    const duration = availability.slotDuration;

    const slots: Slot[] = [];
    let current = start;

    while (current + duration <= end) {
      const slot = this.slotRepository.create({
        availability,
        startTime: this.minutesToTime(current),
        endTime: this.minutesToTime(current + duration),
        maxPatients: availability.maxPatientsPerSlot!,
        bookedCount: 0,
        isActive: true,
      });

      slots.push(slot);
      current += duration;
    }

    return this.slotRepository.save(slots);
  }
}
