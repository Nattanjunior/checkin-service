import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";


describe("Authenticate User Case", () => {
  it("should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(() =>
      sut.execute({
        email: "john.doe@example.com",
        password: "12345678",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });


  it("should not be able to authenticate with wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
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