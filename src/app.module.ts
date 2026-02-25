// src/app.module.ts

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
    // ✅ ENV support
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ✅ Railway Postgres CONFIG (IMPORTANT)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'), // 🔥 MAIN FIX
        autoLoadEntities: true,
        synchronize: true, // demo / internship ke liye OK
      }),
    }),

    // ✅ Feature modules
    AuthModule,
    DoctorModule,
    AvailabilityModule,
    SlotsModule,
    AppointmentModule,
  ],
})
export class AppModule {}