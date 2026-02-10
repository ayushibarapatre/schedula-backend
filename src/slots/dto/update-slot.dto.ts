import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DayOfWeek } from '../enum/day-of-week.enum';

export class UpdateSlotDto {
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}
