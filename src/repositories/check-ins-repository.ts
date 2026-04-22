import { Prisma, Checkin } from "@prisma/client";

export interface CheckInsRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>;
  countByUserId(userId: string): Promise<number>
  findByUserIdOneDate(user_id: string, date: Date): Promise<Checkin | null>;
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>
}