import { Decimal } from "@prisma/client/runtime/library";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./checkIn";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/Max-distance-error";


let UsersRepository: InMemoryCheckInRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInUseCase;

describe("Check in Use Case", () => {
  beforeEach(async () => {
    UsersRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(UsersRepository, gymRepository);

    await gymRepository.create({
      id: 'gym_001',
      title: 'JavaScript the GYM',
      description: '',
      phone: '',
      latitude: -9.9109418,
      longitude: -36.3555163,
    })

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gym_id: 'gym_001',
      user_id: 'user_001',
      userLatitude: -9.9109418,
      userLongitude: -36.3555163,
    })

    expect(checkIn.id).toEqual(expect.any(String));
  });


  // initial TDD => 
  it("should not be able to check in twice in the same day", async () => {
    // Mocking date
    vi.setSystemTime(new Date(2024, 8, 6, 0, 0))

    await sut.execute({
      gym_id: 'gym_001',
      user_id: 'user_001',
      userLatitude: -9.9109418,
      userLongitude: -36.3555163,
    });

    await expect(() =>
      sut.execute({
        gym_id: 'gym_001',
        user_id: 'user_001',
        userLatitude: -9.9109418,
        userLongitude: -36.3555163,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  });

  it("should not be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2024, 8, 6, 0, 0))

    await sut.execute({
      gym_id: 'gym_001',
      user_id: 'user_001',
      userLatitude: -9.9109418,
      userLongitude: -36.3555163,
    });

    vi.setSystemTime(new Date(2024, 8, 21, 0, 0));

    const { checkIn } = await sut.execute({
      gym_id: 'gym_001',
      user_id: 'user_001',
      userLatitude: -9.9109418,
      userLongitude: -36.3555163,
    });

    expect(checkIn.id).toEqual(expect.any(String))
  });


  it("should not be able to check in on distant gym", async () => {

    gymRepository.items.push({
      id: 'gym_002',
      title: 'Javascript gym',
      description: '',
      phone: '',
      latitude: new Decimal(-9.9109418),
      longitude: new Decimal(-36.3555163),
      createdAt: new Date()
    })


    await expect(() =>
      sut.execute({
        gym_id: 'gym_002',
        user_id: 'user-001',
        userLatitude: -9.9500000,
        userLongitude: -36.4000000
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  });
})