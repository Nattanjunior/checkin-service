import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymRepository: InMemoryGymsRepository
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymRepository);
  })

  it("should be able to register", async () => {
    const { gym } = await sut.execute({
      title: 'TS GYM',
      description: null,
      phone: null,
      latitude: -9.9500000,
      longitude: -36.4000000

    });

    expect(gym.id).toEqual(expect.any(String));

  });

});