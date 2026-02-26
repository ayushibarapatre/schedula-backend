import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { AvailabilityModule } from './slots/availability/availability.module';
import { SlotsModule } from './slots/slots.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // PostgreSQL connection (Render / Railway / Local)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        // ✅ ONLY THIS (NO localhost, NO DB_HOST)
        url: config.get<string>('DATABASE_URL'),

        autoLoadEntities: true,
        synchronize: true,

        // ✅ Required for Render / Railway
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    AuthModule,
    DoctorModule,
    AvailabilityModule,
    SlotsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}