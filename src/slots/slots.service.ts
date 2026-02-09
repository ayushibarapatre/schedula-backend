import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './slot.entity';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
  ) {}

  async createSlot(data: CreateSlotDto) {
    const { doctorId, dayOfWeek, startTime, endTime } = data;

    const overlappingSlot = await this.slotRepository
      .createQueryBuilder('slot')
      .where('slot.doctorId = :doctorId', { doctorId })
      .andWhere('slot.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere(':startTime < slot.endTime AND :endTime > slot.startTime', {
        startTime,
        endTime,
      })
      .getOne();

    if (overlappingSlot) {
      throw new BadRequestException(
        'Slot time overlaps with an existing slot',
      );
    }

    const slot = this.slotRepository.create(data);
    return this.slotRepository.save(slot);
  }

  async getSlotsByDoctor(doctorId: string) {
    return this.slotRepository.find({
      where: { doctorId },
      order: { startTime: 'ASC' },
    });
  }

  async updateSlot(id: string, data: UpdateSlotDto) {
    const slot = await this.slotRepository.findOneBy({ id });
    if (!slot) {
      throw new BadRequestException('Slot not found');
    }

    Object.assign(slot, data);
    return this.slotRepository.save(slot);
  }
}
