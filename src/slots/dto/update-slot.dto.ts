import { IsOptional, IsString } from 'class-validator';

export class UpdateSlotDto {
  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}
