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
} from './availability/availability.entity';
import {
  Appointment,
  AppointmentStatus,
} from '../appointment/appointment.entity';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,

    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  // ===================== HELPERS =====================
  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  // ===================== SLOT GENERATION =====================
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

  // ===================== CORE API (WITH isAvailable) =====================
  async getSlotsForDoctorByDate(
    doctorId: number,
    date: string,
  ) {
    const slots = await this.slotRepository.find({
      where: {
        availability: {
          doctor: { id: doctorId },
          isActive: true,
        },
        isActive: true,
      },
      relations: ['availability', 'availability.doctor'],
    });

    if (!slots.length) {
      throw new NotFoundException(
        'No slots found for this doctor',
      );
    }

    // ✅ Explicitly typed response (fixes never[] error)
    const response: {
      slotId: number;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }[] = [];

    for (const slot of slots) {
      const appointment =
        await this.appointmentRepository.findOne({
          where: {
            slotId: slot.id,
            status: AppointmentStatus.BOOKED,
          },
        });

      response.push({
        slotId: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: !appointment, // 🔥 CORE LOGIC
      });
    }

    return response;
  }

  // ===================== EXTRA APIs =====================
  async getSlotsByAvailability(
    availabilityId: number,
  ) {
    const slots = await this.slotRepository.find({
      where: {
        availability: { id: availabilityId },
        isActive: true,
      },
      relations: ['availability'],
    });

    if (!slots.length) {
      throw new NotFoundException(
        'No slots found for this availability',
      );
    }

    return slots;
  }

  async getSlotById(slotId: number) {
    const slot = await this.slotRepository.findOne({
      where: { id: slotId },
      relations: ['availability'],
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    return slot;
  }
}