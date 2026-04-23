import { Prisma, Checkin } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = await prisma.checkin.create({
      data,
    })

    return checkIn;
  }

  async save(data: Checkin) {
    const checkIn = await prisma.checkin.update({
      where: {
        id: data.id
      },
      data,
    })

    return checkIn;
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkin.count({
      where: {
        user_id: userId
      }
    });

    return count;
  }

  async findById(id: string) {
    const checkInId = await prisma.checkin.findUnique({
      where: {
        id,
      }
    });
    return checkInId;
  }

  async findByUserIdOneDate(user_id: string, date: Date) {
    const startOfTheday = dayjs(date).startOf('date');
    const endOfTheday = dayjs(date).endOf('date');

    const checkIn = await prisma.checkin.findFirst({
      where: {
        user_id: user_id,
        createdAt: {
          gte: startOfTheday.toDate(),
          lte: endOfTheday.toDate(),
        }
      }
    })

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkin.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns;
  }

}