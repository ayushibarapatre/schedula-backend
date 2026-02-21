import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  // =====================================================
  // 🔹 STEP 3: Appointment Booking (slotId based)
  // =====================================================
  @Post('book')
  bookAppointment(
    @Body('slotId', ParseIntPipe) slotId: number,
  ) {
    return this.appointmentService.bookAppointment(
      slotId,
    );
  }

  // =====================================================
  // 🔹 Appointment Reschedule (slotId based)
  // =====================================================
  @Patch(':id/reschedule')
  rescheduleAppointment(
    @Param('id', ParseIntPipe) appointmentId: number,
    @Body('slotId', ParseIntPipe) slotId: number,
  ) {
    return this.appointmentService.rescheduleAppointment(
      appointmentId,
      slotId,
    );
  }

  // =====================================================
  // 🔹 Appointment Cancellation
  // =====================================================
  @Patch(':id/cancel')
  cancelAppointment(
    @Param('id', ParseIntPipe) appointmentId: number,
  ) {
    return this.appointmentService.cancelAppointment(
      appointmentId,
    );
  }
}