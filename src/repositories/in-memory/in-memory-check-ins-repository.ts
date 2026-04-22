import { Prisma, Checkin } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInsRepository {
  public items: Checkin[] = [];

  async findByUserIdOneDate(user_id: string, date: Date) {
    const checkInOnSameDay = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.createdAt)
      const isOnSameDate = checkInDate.isSame(date, 'day');

      return checkIn.user_id === user_id && isOnSameDate;
    });

    if (!checkInOnSameDay) {
      return null;
    }

    return checkInOnSameDay;
  }


  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }



  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
  }



  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validetedAt: data.validetedAt ? new Date(data.validetedAt) : null,
      createdAt: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }
}