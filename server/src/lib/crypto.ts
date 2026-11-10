import crypto from 'crypto';
import Database from 'better-sqlite3';

const ALGORITHM = 'aes-256-gcm';

let cachedKey: Buffer | null = null;

/**
 * AES-256-GCM uses a 32-byte key, hex-encoded as 64 chars.
 * A typo'd ENCRYPTION_KEY (e.g. "abc") would historically fall through
 * the placeholder check, get truncated to 1.5 bytes, and only fail at
 * the first encrypt() call with a cryptic node:crypto error. Validate
 * the length up front and fail fast with an actionable message.
 */
const KEY_BYTES = 32;
const KEY_HEX_LEN = KEY_BYTES * 2;

function parseHexKey(value: string, source: 'env' | 'db'): Buffer {
  if (value.length !== KEY_HEX_LEN || !/^[0-9a-fA-F]+$/.test(value)) {
    throw new Error(
      `Invalid ENCRYPTION_KEY (${source}): expected ${KEY_HEX_LEN} hex chars (32 bytes), got ${value.length} chars. ` +
      `Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
    );
  }
  return Buffer.from(value, 'hex');
}

/**
 * Initialize encryption key from env, DB, or generate a new one.
 * Must be called after DB is initialized.
 */
export function initEncryptionKey(db: Database.Database): void {
  // 1. Check env var
  const envKey = process.env.ENCRYPTION_KEY;
  if (envKey && envKey !== 'your-64-char-hex-key-here') {
    cachedKey = parseHexKey(envKey, 'env');
    return;
  }

  // 2. Check DB for persisted key
  const row = db.prepare("SELECT value FROM settings WHERE key = 'encryption_key'").get() as { value: string } | undefined;
  if (row) {
    cachedKey = parseHexKey(row.value, 'db');
    return;
  }

  // 3. Generate and persist
  cachedKey = crypto.randomBytes(KEY_BYTES);
  db.prepare("INSERT INTO settings (key, value) VALUES ('encryption_key', ?)").run(cachedKey.toString('hex'));
}

function getEncryptionKey(): Buffer {
  if (!cachedKey) {
    throw new Error('Encryption key not initialized. Call initEncryptionKey() first.');
  }
  return cachedKey;
}

export function encrypt(text: string): { encrypted: string; iv: string; authTag: string } {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

export function decrypt(encrypted: string, iv: string, authTag: string): string {
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function maskKey(key: string): string {
  if (key.length <= 8) return '****' + key.slice(-4);
  return key.slice(0, 4) + '...' + key.slice(-4);
}

const PASSWORD_HASH_ALGORITHM = 'sha256';
const PASSWORD_HASH_ITERATIONS = 600_000;
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_HASH_BYTES = 32;
const LEGACY_PASSWORD_SALT = 'omnikey-admin-salt-12345';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(PASSWORD_SALT_BYTES);
  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    PASSWORD_HASH_ITERATIONS,
    PASSWORD_HASH_BYTES,
    PASSWORD_HASH_ALGORITHM,
  );

  return [
    'pbkdf2',
    PASSWORD_HASH_ITERATIONS,
    salt.toString('hex'),
    derivedKey.toString('hex'),
  ].join('$');
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (typeof password !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;

    const iterations = Number(parts[1]);
    if (
      !Number.isInteger(iterations) ||
      iterations < 100_000 ||
      iterations > 2_000_000 ||
      !/^[0-9a-f]{32}$/i.test(parts[2]) ||
      !/^[0-9a-f]{64}$/i.test(parts[3])
    ) {
      return false;
    }

    const expected = Buffer.from(parts[3], 'hex');
    const actual = crypto.pbkdf2Sync(
      password,
      Buffer.from(parts[2], 'hex'),
      iterations,
      PASSWORD_HASH_BYTES,
      PASSWORD_HASH_ALGORITHM,
    );

    return crypto.timingSafeEqual(actual, expected);
  }

  if (!/^[0-9a-f]{64}$/i.test(storedHash)) return false;

  const expected = Buffer.from(storedHash, 'hex');
  const actual = crypto
    .createHmac('sha256', LEGACY_PASSWORD_SALT)
    .update(password)
    .digest();

  return crypto.timingSafeEqual(actual, expected);
}

export function needsPasswordRehash(storedHash: string): boolean {
  return !storedHash.startsWith('pbkdf2$');
}
