import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { AvailabilityModule } from './slots/availability/availability.module';
import { SlotsModule } from './slots/slots.module';

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
    url: config.get('DATABASE_URL'),
    autoLoadEntities: true,
    synchronize: true,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
}),

    // ✅ Feature Modules
    AuthModule,
    DoctorModule,
    AvailabilityModule,
    SlotsModule,
  ],
})
export class AppModule {}