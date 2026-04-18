import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";


let UsersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase;

describe("Get User profile Use Case", () => {
  beforeEach(() => {
    UsersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(UsersRepository);
  })

  it("should be able to get user profile", async () => {

    const createdUser = await UsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("12345678", 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    });

    expect(user.name).toEqual('John Doe');

  });

  it("should not be able to get user profile with wrong id", async () => {

    await expect(() =>
      sut.execute({
        userId: 'not-existing-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });


})