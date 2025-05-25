import { PrismaClient } from "@prisma/client";


export async function userExist(email: string, client: PrismaClient): Promise<boolean> {
    const user = await client.user.findFirst({
        where: {
            email: email
        }
    })
    return !!user
}

