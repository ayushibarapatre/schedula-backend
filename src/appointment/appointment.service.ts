import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Appointment,
  AppointmentStatus,
} from './appointment.entity';
import { Slot } from '../slots/slot.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,

    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
  ) {}

  // =====================================================
  // 🔹 BOOK APPOINTMENT
  // =====================================================
  async bookAppointment(
    slotId: number,
    patientId: string,
  ) {
    // 1️⃣ slot fetch
    const slot = await this.slotRepository.findOne({
      where: { id: slotId, isActive: true },
      relations: ['availability', 'availability.doctor', 'availability.doctor.user'],
    });

    if (!slot) {
      throw new BadRequestException('Slot not found');
    }

    // 2️⃣ capacity check ✅ (MOST IMPORTANT)
    if (slot.bookedCount >= slot.maxPatients) {
      throw new BadRequestException('Slot already booked');
    }

    // 3️⃣ appointment create
    const appointment = this.appointmentRepo.create({
      slotId: slot.id,
      doctorId: slot.availability.doctor.user.id,
      patientId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: AppointmentStatus.BOOKED,
    });

    await this.appointmentRepo.save(appointment);

    // 4️⃣ increment slot count ✅
    slot.bookedCount += 1;
    await this.slotRepository.save(slot);

    return {
      message: 'Appointment booked successfully',
      appointment,
    };
  }

  // =====================================================
  // 🔹 RESCHEDULE APPOINTMENT
  // =====================================================
  async rescheduleAppointment(
    appointmentId: string,
    slotId: number,
    patientId: string,
  ) {
    const existing = await this.appointmentRepo.findOne({
      where: { id: appointmentId, patientId },
    });

    if (!existing) {
      throw new BadRequestException('Appointment not found');
    }

    if (existing.status !== AppointmentStatus.BOOKED) {
      throw new BadRequestException(
        'Only booked appointments can be rescheduled',
      );
    }

    const newSlot = await this.slotRepository.findOne({
      where: { id: slotId, isActive: true },
      relations: ['availability', 'availability.doctor', 'availability.doctor.user'],
    });

    if (!newSlot) {
      throw new BadRequestException('Slot not found');
    }

    if (newSlot.bookedCount >= newSlot.maxPatients) {
      throw new BadRequestException('Slot already booked');
    }

    // old appointment → RESCHEDULED
    existing.status = AppointmentStatus.RESCHEDULED;
    await this.appointmentRepo.save(existing);

    // new appointment
    const newAppointment = this.appointmentRepo.create({
      slotId: newSlot.id,
      doctorId: newSlot.availability.doctor.user.id,
      patientId,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      status: AppointmentStatus.BOOKED,
      rescheduledFrom: existing.id,
    });

    await this.appointmentRepo.save(newAppointment);

    // increment new slot
    newSlot.bookedCount += 1;
    await this.slotRepository.save(newSlot);

    return {
      message: 'Appointment rescheduled successfully',
      newAppointment,
    };
  }

  // =====================================================
  // 🔹 CANCEL APPOINTMENT
  // =====================================================
  async cancelAppointment(
    appointmentId: string,
    patientId: string,
  ) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId, patientId },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.BOOKED) {
      throw new BadRequestException(
        'Only booked appointments can be cancelled',
      );
    }

    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancelledAt = new Date();

    await this.appointmentRepo.save(appointment);

    return {
      message: 'Appointment cancelled successfully',
    };
  }
}