import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hashedPassword: string){
    return bcrypt.compare(password, hashedPassword)
}