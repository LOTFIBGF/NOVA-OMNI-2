import { describe, it, expect, beforeAll } from 'vitest';
import crypto from 'crypto';
import { initDb } from '../../db/index.js';
import {
  encrypt,
  decrypt,
  maskKey,
  hashPassword,
  verifyPassword,
  needsPasswordRehash,
} from '../../lib/crypto.js';

describe('Crypto', () => {
  beforeAll(() => {
    process.env.ENCRYPTION_KEY = '0'.repeat(64);
    initDb(':memory:');
  });

  it('should encrypt and decrypt a key round-trip', () => {
    const original = 'gsk_test1234567890abcdef';
    const { encrypted, iv, authTag } = encrypt(original);
    expect(decrypt(encrypted, iv, authTag)).toBe(original);
  });

  it('should produce different ciphertext for same input', () => {
    const a = encrypt('same-key');
    const b = encrypt('same-key');
    expect(a.encrypted).not.toBe(b.encrypted);
    expect(a.iv).not.toBe(b.iv);
  });

  it('should fail to decrypt with wrong auth tag', () => {
    const { encrypted, iv } = encrypt('test-key');
    expect(() => decrypt(encrypted, iv, 'a'.repeat(32))).toThrow();
  });

  describe('maskKey', () => {
    it('should mask long keys', () => {
      expect(maskKey('gsk_test1234567890abcdef')).toBe('gsk_...cdef');
    });

    it('should mask short keys', () => {
      expect(maskKey('abcd')).toBe('****abcd');
    });
  });

  describe('password hashing', () => {
    it('generates unique salted hashes and verifies passwords', () => {
      const first = hashPassword('correct-password');
      const second = hashPassword('correct-password');
      expect(first).not.toBe(second);
      expect(first.startsWith('pbkdf2$')).toBe(true);
      expect(verifyPassword('correct-password', first)).toBe(true);
      expect(verifyPassword('wrong-password', first)).toBe(false);
      expect(needsPasswordRehash(first)).toBe(false);
    });

    it('verifies legacy hashes and marks them for upgrade', () => {
      const legacyHash = crypto
        .createHmac('sha256', 'omnikey-admin-salt-12345')
        .update('admin')
        .digest('hex');
      expect(verifyPassword('admin', legacyHash)).toBe(true);
      expect(verifyPassword('wrong', legacyHash)).toBe(false);
      expect(needsPasswordRehash(legacyHash)).toBe(true);
    });

    it('rejects malformed hashes', () => {
      expect(verifyPassword('password', 'invalid')).toBe(false);
      expect(verifyPassword('password', 'pbkdf2$bad$salt$hash')).toBe(false);
    });
  });
});
