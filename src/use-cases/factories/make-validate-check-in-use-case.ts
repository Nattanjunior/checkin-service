import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInUseCase } from "../valide-check-in";

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository();
  const UseCase = new ValidateCheckInUseCase(checkInRepository);

  return UseCase;
}