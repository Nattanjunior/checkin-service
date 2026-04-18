import { UsersRepository } from "@/repositories/users-repository";
import type { User } from "@prisma/client";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";

interface AuthenticateRequest {
    email: string;
    password: string;
}

interface AuthenticateResponse {
    user: User;
}

export class AuthenticateUseCase {
    constructor(private userRepository: UsersRepository) { }
    async execute({ email, password }: AuthenticateRequest): Promise<AuthenticateResponse> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doesPasswordMatch = await compare(password, user.password_hash);
        if (!doesPasswordMatch) {
            throw new InvalidCredentialsError();
        }

        return { user };
    }



}