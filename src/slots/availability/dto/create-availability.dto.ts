import {
  IsEnum,
  IsNotEmpty,
  Matches,
  IsInt,
  Min,
  Max,
  ValidateIf,
  IsOptional,
  IsEmpty,
} from 'class-validator';

import {
  Day,
  AvailabilityType,
  SchedulingType,
  TimeOfDay,
} from '../availability.entity';

export class CreateAvailabilityDto {
  // 🔹 RECURRING or CUSTOM
  @IsEnum(AvailabilityType)
  availabilityType: AvailabilityType;

  // 🔹 Required only for RECURRING
  @ValidateIf(o => o.availabilityType === AvailabilityType.RECURRING)
  @IsEnum(Day)
  day?: Day;

  // 🔹 Required only for CUSTOM
  @ValidateIf(o => o.availabilityType === AvailabilityType.CUSTOM)
  @IsNotEmpty()
  date?: string; // YYYY-MM-DD

  // 🔹 WAVE or STREAM
  @IsEnum(SchedulingType)
  schedulingType: SchedulingType;

  // 🔹 MORNING / EVENING (mentor feedback)
  @IsEnum(TimeOfDay)
  timeOfDay: TimeOfDay;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime: string;

  // 🔹 WAVE ONLY
  @ValidateIf(o => o.schedulingType === SchedulingType.WAVE)
  @IsInt()
  @Min(5)
  @Max(240)
  slotDuration?: number;

  @ValidateIf(o => o.schedulingType === SchedulingType.WAVE)
  @IsInt()
  @Min(1)
  @Max(50)
  maxPatientsPerSlot?: number;

  // 🔹 STREAM ONLY (one big slot)
  @ValidateIf(o => o.schedulingType === SchedulingType.STREAM)
  @IsInt()
  @Min(1)
  @Max(500)
  maxCapacity?: number;

  // 🔹 STREAM must NOT have slot fields
  @ValidateIf(o => o.schedulingType === SchedulingType.STREAM)
  @IsEmpty({ message: 'slotDuration not allowed for STREAM' })
  slotDurationStreamCheck?: any;

  @ValidateIf(o => o.schedulingType === SchedulingType.STREAM)
  @IsEmpty({ message: 'maxPatientsPerSlot not allowed for STREAM' })
  maxPatientsStreamCheck?: any;
}
