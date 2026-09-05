/**
 * Native Web Crypto PBKDF2 password hashing compatible with Cloudflare Workers.
 */

const ITERATIONS = 100_000;
const KEY_LEN = 32; // 256 bits

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    KEY_LEN * 8
  );

  const saltHex = bufferToHex(salt.buffer);
  const hashHex = bufferToHex(derivedBits);

  return `pbkdf2:${ITERATIONS}:${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
      return false;
    }

    const iterations = parseInt(parts[1], 10);
    const salt = hexToBuffer(parts[2]);
    const expectedHashHex = parts[3];

    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: 'SHA-256',
      },
      passwordKey,
      KEY_LEN * 8
    );

    const actualHashHex = bufferToHex(derivedBits);

    // Constant-time comparison
    if (actualHashHex.length !== expectedHashHex.length) {
      return false;
    }

    let diff = 0;
    for (let i = 0; i < actualHashHex.length; i++) {
      diff |= actualHashHex.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
    }

    return diff === 0;
  } catch {
    return false;
  }
}
