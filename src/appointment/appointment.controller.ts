import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // 🔹 Appointment Booking
  @Post()
  bookAppointment(@Body() body: any) {
    return this.appointmentService.bookAppointment(body);
  }

  // 🔹 Appointment Reschedule
  @Patch(':id/reschedule')
  rescheduleAppointment(
    @Param('id') appointmentId: string,
    @Body() body: any,
  ) {
    return this.appointmentService.rescheduleAppointment(
      appointmentId,
      body,
    );
  }

  // ❌ Appointment Cancellation (Doctor / Patient)
  @Patch(':id/cancel')
  cancelAppointment(@Param('id') appointmentId: string) {
    return this.appointmentService.cancelAppointment(appointmentId);
  }
}