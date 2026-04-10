import { SignJWT, jwtVerify } from 'jose';
import { env } from '$env/dynamic/private';

const getSecret = () => new TextEncoder().encode(env.JWT_SECRET);

export async function signJwtToken(payload: { id: string; email: string; isPaid?: boolean }) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('2h')
		.sign(getSecret());
}

export async function verifyToken(
	token: string
): Promise<{ id: string; email: string; isPaid: boolean } | null> {
	try {
		const { payload } = await jwtVerify(token, getSecret());
		return payload as { id: string; email: string; isPaid: boolean };
	} catch (e) {
		return null;
	}
}
