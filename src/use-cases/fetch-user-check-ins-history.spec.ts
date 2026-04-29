import dayjs from "dayjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckInRepository
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch User Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
  });

  it("should be able to fetch check-in history", async () => {

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

    const { checkIns } = await sut.execute({
      userId: 'user-001',
      page: 1
    })

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-001' }),
      expect.objectContaining({ gym_id: 'gym-002' }),
    ]);
  });


  it("should be able to fetch paginated check-In history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-0${i}`,
        user_id: 'user-001',
        date: dayjs().add(i, 'day').toDate(),
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-001',
      page: 2
    })

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-021' }),
      expect.objectContaining({ gym_id: 'gym-022' }),
    ]);
  });

})