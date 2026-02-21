import {
  Injectable,
  BadRequestException,
  NotFoundException,
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
    private readonly slotRepo: Repository<Slot>,
  ) {}

  // =====================================================
  // 🔹 BOOK APPOINTMENT (slotId based)
  // =====================================================
  async bookAppointment(slotId: number) {
    const slot = await this.slotRepo.findOne({
      where: { id: slotId, isActive: true },
      relations: ['availability', 'availability.doctor'],
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.bookedCount >= slot.maxPatients) {
      throw new BadRequestException(
        'Slot is fully booked',
      );
    }

    const appointment = this.appointmentRepo.create({
      doctorId: slot.availability.doctor.id.toString(), // ✅ FIX
      slotId: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: AppointmentStatus.BOOKED,
    });

    await this.appointmentRepo.save(appointment);

    slot.bookedCount += 1;
    await this.slotRepo.save(slot);

    return {
      message: 'Appointment booked successfully',
      appointment,
    };
  }

  // =====================================================
  // 🔁 RESCHEDULE APPOINTMENT (slotId based)
  // =====================================================
  async rescheduleAppointment(
    appointmentId: number,
    newSlotId: number,
  ) {
    const existingAppointment =
      await this.appointmentRepo.findOne({
        where: { id: appointmentId.toString() }, // ✅ FIX
      });

    if (!existingAppointment) {
      throw new NotFoundException(
        'Appointment not found',
      );
    }

    if (
      existingAppointment.status !==
      AppointmentStatus.BOOKED
    ) {
      throw new BadRequestException(
        'Only booked appointments can be rescheduled',
      );
    }

    const newSlot = await this.slotRepo.findOne({
      where: { id: newSlotId, isActive: true },
      relations: ['availability', 'availability.doctor'],
    });

    if (!newSlot) {
      throw new NotFoundException('New slot not found');
    }

    if (newSlot.bookedCount >= newSlot.maxPatients) {
      throw new BadRequestException(
        'New slot is fully booked',
      );
    }

    existingAppointment.status =
      AppointmentStatus.RESCHEDULED;
    await this.appointmentRepo.save(
      existingAppointment,
    );

    const newAppointment =
      this.appointmentRepo.create({
        doctorId:
          newSlot.availability.doctor.id.toString(), // ✅ FIX
        slotId: newSlot.id,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        status: AppointmentStatus.BOOKED,
        rescheduledFrom:
          existingAppointment.id,
      });

    await this.appointmentRepo.save(newAppointment);

    newSlot.bookedCount += 1;
    await this.slotRepo.save(newSlot);

    return {
      message: 'Appointment rescheduled successfully',
      oldAppointment: existingAppointment,
      newAppointment,
    };
  }

  // =====================================================
  // ❌ CANCEL APPOINTMENT
  // =====================================================
  async cancelAppointment(appointmentId: number) {
    const appointment =
      await this.appointmentRepo.findOne({
        where: { id: appointmentId.toString() }, // ✅ FIX
      });

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found',
      );
    }

    if (
      appointment.status !==
      AppointmentStatus.BOOKED
    ) {
      throw new BadRequestException(
        'Only booked appointments can be cancelled',
      );
    }

    appointment.status =
      AppointmentStatus.CANCELLED;
    appointment.cancelledAt = new Date();

    await this.appointmentRepo.save(appointment);

    return {
      message: 'Appointment cancelled successfully',
      appointment,
    };
  }
}