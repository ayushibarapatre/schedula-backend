import { IsString, IsOptional } from 'class-validator';

export class UpdateSlotDto {
  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  dayOfWeek?: string;
}
