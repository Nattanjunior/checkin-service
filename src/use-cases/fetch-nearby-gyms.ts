import { Gym } from "@prisma/client";
import { GymRepository } from "@/repositories/gym-repository";
import { getOrSetCache } from "../lib/cache";

interface FeatchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FeatchNearbyGymsUseCaseResponse {
  status: string
  gyms: Gym[]
  cache: string
}

export class FeatchNearbyGymsUseCase {
  constructor(private gymRepository: GymRepository) { }

  async execute({
    userLatitude,
    userLongitude
  }: FeatchNearbyGymsUseCaseRequest): Promise<FeatchNearbyGymsUseCaseResponse> {
    const cacheKey = `gym-nearby:${userLatitude}:${userLongitude}`;

    const { data, cache } = await getOrSetCache(
      cacheKey,
      async () => {
        const gyms = await this.gymRepository.findManyNearby(
          {
            latitude: userLatitude,
            longitude: userLongitude
          }
        );

        return {
          status: 'SEARCH SUCCESSFULLY',
          gyms
        }
      },
      { ttl: 60 * 5 }
    )


    return {
      ...data,
      cache
    };
  }
}
