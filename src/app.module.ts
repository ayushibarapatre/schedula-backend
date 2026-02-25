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

    // ✅ PostgreSQL TypeORM config
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: String(config.get('DB_PASSWORD')),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // demo ke liye OK
      }),
    }),

    // ✅ Feature Modules
    AuthModule,
    DoctorModule,
    AvailabilityModule,
    SlotsModule,
    AppointmentModule,
  ],
})
export class AppModule {}