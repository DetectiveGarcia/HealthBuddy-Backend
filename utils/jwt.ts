import * as Jose from 'jose';
import { JWTUserPayload } from '../types/jwt';


const secret = process.env.JWT_SECRET;
if(!secret) {
    throw new Error("JWT_SECRET environment variable  is missing");
}

const encodedSecret = new TextEncoder().encode(secret);

export async function signJWT(payload: Partial<JWTUserPayload>, expiresIn: string = '15m'): Promise<string> {
    return await new Jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedSecret);
}

export async function verifyJWT(token: string): Promise<JWTUserPayload | null> {

    try {
        const { payload } = await Jose.jwtVerify(token, encodedSecret);
        return payload as JWTUserPayload;
    } catch (error) {
        console.log('verifyJWT error: ', error);
        
        return null;
    }
}