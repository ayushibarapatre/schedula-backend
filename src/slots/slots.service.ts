import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './slot.entity';
import { Availability } from './availability/availability.entity';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,

    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
  ) {}

  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private minutesToTime(min: number): string {
    const h = Math.floor(min / 60)
      .toString()
      .padStart(2, '0');
    const m = (min % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  async generateSlots(availabilityId: number) {
    const availability =
      await this.availabilityRepository.findOne({
        where: { id: availabilityId },
      });

    if (!availability) return [];

    const start = this.timeToMinutes(
      availability.startTime,
    );
    const end = this.timeToMinutes(
      availability.endTime,
    );

    const slots: Slot[] = [];
    let current = start;

    while (
      current + availability.slotDuration <=
      end
    ) {
      const slot = this.slotRepository.create({
        availability,
        startTime: this.minutesToTime(current),
        endTime: this.minutesToTime(
          current + availability.slotDuration,
        ),
        maxPatients: availability.maxPatientsPerSlot,
      });

      slots.push(slot);
      current += availability.slotDuration;
    }

    return this.slotRepository.save(slots);
  }
}
