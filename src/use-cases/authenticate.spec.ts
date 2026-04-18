import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";


let UsersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    UsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(UsersRepository);
  })

  it("should be able to authenticate", async () => {

    await UsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("12345678", 6),
    })

    const { user } = await sut.execute({
      email: "john.doe@example.com",
      password: "12345678",
    });

    expect(user.id).toEqual(expect.any(String));

  });

  it("should not be able to authenticate with wrong email", async () => {

    await expect(() =>
      sut.execute({
        email: "john.doe@example.com",
        password: "12345678",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });


  it("should not be able to authenticate with wrong password", async () => {

    await UsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("12345678", 6),
    });

    await expect(() =>
      sut.execute({
        email: "john.doe@example.com",
        password: "12651",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

})