import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { AvailabilityModule } from './slots/availability/availability.module';
import { SlotsModule } from './slots/slots.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: 'db_dev.sqlite',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    AuthModule,
    DoctorModule,        // ✅ REQUIRED
    AvailabilityModule,  // ✅ REQUIRED
    SlotsModule,
    AppointmentModule,
  ],
})
export class AppModule {}
