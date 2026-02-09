import { IsString, Matches } from 'class-validator';

export class CreateSlotDto {
  @IsString()
  doctorId: string;

  @IsString()
  dayOfWeek: string;

  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;

  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  endTime: string;
}
