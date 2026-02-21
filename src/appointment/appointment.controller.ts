import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentService } from './appointment.service';

@UseGuards(AuthGuard('jwt'))
@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  // =====================================================
  // 🔹 BOOK APPOINTMENT (slotId based)
  // =====================================================
  @Post('book')
  bookAppointment(
    @Req() req: any,
    @Body('slotId', ParseIntPipe) slotId: number,
  ) {
    const patientId = req.user.sub; // ✅ JWT se
    return this.appointmentService.bookAppointment(
      slotId,
      patientId,
    );
  }

  // =====================================================
  // 🔹 RESCHEDULE APPOINTMENT
  // =====================================================
  @Patch(':id/reschedule')
  rescheduleAppointment(
    @Req() req: any,
    @Param('id') appointmentId: string,
    @Body('slotId', ParseIntPipe) slotId: number,
  ) {
    const patientId = req.user.sub;
    return this.appointmentService.rescheduleAppointment(
      appointmentId,
      slotId,
      patientId,
    );
  }

  // =====================================================
  // 🔹 CANCEL APPOINTMENT
  // =====================================================
  @Patch(':id/cancel')
  cancelAppointment(
    @Req() req: any,
    @Param('id') appointmentId: string,
  ) {
    const patientId = req.user.sub;
    return this.appointmentService.cancelAppointment(
      appointmentId,
      patientId,
    );
  }
}