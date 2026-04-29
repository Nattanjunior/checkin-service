import { beforeEach, describe, expect, it } from "vitest";
import dayjs from "dayjs";
import { InMemoryCheckInRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInRepository
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to get check-ins count from metrics", async () => {

    await checkInsRepository.create({
      gym_id: 'gym-001',
      user_id: 'user-001',
      date: dayjs().toDate()
    })

    await checkInsRepository.create({
      gym_id: 'gym-002',
      user_id: 'user-001',
      date: dayjs(1, 'day').toDate()
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-001',
    })

    expect(checkInsCount).toEqual(2);

  });

})