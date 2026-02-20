import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus, ScheduleType } from './appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  // 🔹 APPOINTMENT BOOKING
  async bookAppointment(body: any) {
    const {
      doctorId,
      patientId,
      date,
      startTime,
      endTime,
      scheduleType,
    } = body;

    if (!doctorId || !patientId || !date || !startTime || !scheduleType) {
      throw new BadRequestException('Missing required appointment fields');
    }

    if (!Object.values(ScheduleType).includes(scheduleType)) {
      throw new BadRequestException('Invalid scheduleType');
    }

    // 🔹 WAVE: slot clash check (DB)
    if (scheduleType === ScheduleType.WAVE) {
      const existingSlot = await this.appointmentRepo.findOne({
        where: {
          doctorId,
          date,
          startTime,
          endTime,
          status: AppointmentStatus.BOOKED,
        },
      });

      if (existingSlot) {
        throw new BadRequestException('Slot already booked');
      }
    }

    const appointment = this.appointmentRepo.create({
      doctorId,
      patientId,
      date,
      startTime,
      endTime,
      scheduleType,
      status: AppointmentStatus.BOOKED,
    });

    await this.appointmentRepo.save(appointment);

    return {
      message: 'Appointment booked successfully',
      appointment,
    };
  }

  // 🔁 APPOINTMENT RESCHEDULE
  async rescheduleAppointment(appointmentId: string, body: any) {
    const { date, startTime, endTime, scheduleType } = body;

    const existingAppointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (existingAppointment.status !== AppointmentStatus.BOOKED) {
      throw new BadRequestException(
        'Only booked appointments can be rescheduled',
      );
    }

    // 🔹 WAVE: new slot clash check
    if (scheduleType === ScheduleType.WAVE) {
      const slotBooked = await this.appointmentRepo.findOne({
        where: {
          doctorId: existingAppointment.doctorId,
          date,
          startTime,
          endTime,
          status: AppointmentStatus.BOOKED,
        },
      });

      if (slotBooked) {
        throw new BadRequestException('New slot already booked');
      }
    }

    // 🔹 Old appointment → RESCHEDULED
    existingAppointment.status = AppointmentStatus.RESCHEDULED;
    await this.appointmentRepo.save(existingAppointment);

    // 🔹 New appointment → BOOKED
    const newAppointment = this.appointmentRepo.create({
      doctorId: existingAppointment.doctorId,
      patientId: existingAppointment.patientId,
      date,
      startTime,
      endTime,
      scheduleType,
      status: AppointmentStatus.BOOKED,
      rescheduledFrom: existingAppointment.id,
    });

    await this.appointmentRepo.save(newAppointment);

    return {
      message: 'Appointment rescheduled successfully',
      oldAppointment: existingAppointment,
      newAppointment,
    };
  }

  // ❌ APPOINTMENT CANCELLATION
  async cancelAppointment(appointmentId: string) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment already cancelled');
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
      appointment,
    };
  }
}