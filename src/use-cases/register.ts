import { tr } from "zod/locales";
import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";


interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export async function registerUseCase({
    name, email, password
}: RegisterUseCaseRequest) {


    const password_hash = await hash(password, 6);

    const userWithEmailExists = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (userWithEmailExists) {
        throw new Error("User with this email already exists.");
    }

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash
        }
    });
}
