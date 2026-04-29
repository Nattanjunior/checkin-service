import { Prisma, Checkin } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";
import { DuplicateCheckInError } from "../../use-cases/errors/duplicate-check-In-error";

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

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id)
    if (!checkIn) return null

    return checkIn;
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
    const alreadyExists = this.items.find(item =>
      item.user_id === data.user_id &&
      dayjs(item.date).isSame(data.date, 'day')
    )

    if (alreadyExists) {
      throw new DuplicateCheckInError();
    }

    const checkIn = {
      id: randomUUID(),
      date: data.date ? new Date(data.date) : new Date(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
      createdAt: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async save(checkIn: Checkin) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

    if (checkInIndex >= 0) this.items[checkInIndex] = checkIn

    return checkIn;
  }
}