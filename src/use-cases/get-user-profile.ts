import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getOrSetCache } from "../lib/cache";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  status: string
  user: User;
  cache: string
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) { }

  async execute({ userId }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const cacheKey = `get-profile:${userId}`

    const { data, cache } = await getOrSetCache(
      cacheKey,
      async () => {
        const user = await this.userRepository.findById(userId)

        if (!user) {
          throw new ResourceNotFoundError()
        }

        return {
          status: 'SEARCH SUCCESSFULLY COMPLETED',
          user
        }
      },
      { ttl: 60 * 5 }
    )

    return {
      ...data,
      cache
    }
  }
}