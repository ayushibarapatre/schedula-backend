import { IsEnum, IsString } from 'class-validator';
import { DayOfWeek } from '../enum/day-of-week.enum';

export class CreateSlotDto {
  @IsString()
  doctorId: string;

  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}
