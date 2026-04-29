import dayjs from 'dayjs';
import { Checkin, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { GymRepository } from "../repositories/gym-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "../utils/get-distance-between.coordinates";
import { MaxDistanceError } from "./errors/Max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { DuplicateCheckInError } from './errors/duplicate-check-In-error';

interface CheckInUseCaseRequest {
  user_id: string;
  gym_id: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: Checkin;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymRepository,
  ) { }

  async execute({ user_id, gym_id, userLatitude, userLongitude }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gym_id)
    const today = dayjs().startOf('day').toDate()

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    try {
      const checkIn = await this.checkInsRepository.create({
        gym_id,
        user_id,
        date: today,
      })

      return { checkIn }
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new MaxNumberOfCheckInsError()
      }

      if (err instanceof DuplicateCheckInError) {
        throw new MaxNumberOfCheckInsError()
      }

      throw err
    }
  }
}