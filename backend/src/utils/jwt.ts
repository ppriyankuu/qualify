import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload, UserRole } from '../types';

const DEFAULT_SECRET = 'qualify-scholarship-jwt-secret-key-2026';
const ALGORITHM = 'HS256';
const TOKEN_EXPIRY = '7d';

function getSecretKey(secret?: string): Uint8Array {
  const secretKey = secret || DEFAULT_SECRET;
  return new TextEncoder().encode(secretKey);
}

export async function signToken(
  payload: { sub: string; email: string; role: UserRole },
  secret?: string
): Promise<string> {
  const key = getSecretKey(secret);
  return await new SignJWT({
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(key);
}

export async function verifyToken(token: string, secret?: string): Promise<JWTPayload> {
  const key = getSecretKey(secret);
  const { payload } = await jwtVerify(token, key, {
    algorithms: [ALGORITHM],
  });

  return {
    sub: payload.sub as string,
    email: (payload as Record<string, unknown>).email as string,
    role: (payload as Record<string, unknown>).role as UserRole,
    iat: payload.iat,
    exp: payload.exp,
  };
}
