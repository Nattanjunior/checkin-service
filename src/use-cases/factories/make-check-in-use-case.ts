import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CheckInUseCase } from "../checkIn";

export function makeCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository();
  const gymRepository = new PrismaGymsRepository();
  const UseCase = new CheckInUseCase(checkInRepository, gymRepository);

  return UseCase;
}