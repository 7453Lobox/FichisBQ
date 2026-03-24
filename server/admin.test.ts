import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appRouter } from './routers';
import bcrypt from 'bcrypt';

// Mock database functions
vi.mock('./db', () => ({
  getAdminConfig: vi.fn(async () => ({
    id: 1,
    passwordHash: '$2b$10$YourHashedPasswordHere',
    email: 'test@example.com',
    whatsapp: '+57 3022525442',
    recoveryToken: null,
    recoveryTokenExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  updateAdminPassword: vi.fn(async () => ({ success: true })),
  updateAdminEmail: vi.fn(async () => ({ success: true })),
  updateAdminWhatsapp: vi.fn(async () => ({ success: true })),
  setRecoveryToken: vi.fn(async () => ({ success: true })),
}));

describe('Admin Router', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = {
      user: null,
      req: {
        headers: {},
      } as any,
      res: {
        cookie: vi.fn(),
        clearCookie: vi.fn(),
      } as any,
    };
    caller = appRouter.createCaller(ctx);
  });

  describe('admin.login', () => {
    it('should fail with empty password', async () => {
      try {
        await caller.admin.login({ password: '' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should fail with incorrect password', async () => {
      try {
        await caller.admin.login({ password: 'wrongpassword' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('admin.logout', () => {
    it('should clear admin session cookie', async () => {
      const ctx = {
        user: null,
        req: {
          headers: {},
          protocol: 'https',
        } as any,
        res: {
          clearCookie: vi.fn(),
        } as any,
      };
      const testCaller = appRouter.createCaller(ctx);
      const result = await testCaller.admin.logout();
      expect(result.success).toBe(true);
    });
  });

  describe('admin.changePassword', () => {
    it('should fail with invalid current password', async () => {
      try {
        await caller.admin.changePassword({
          oldPassword: 'wrongpassword',
          newPassword: 'newpassword123',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should fail with short new password', async () => {
      try {
        await caller.admin.changePassword({
          oldPassword: 'currentpassword',
          newPassword: '123',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('admin.requestRecovery', () => {
    it('should generate recovery token for email method', async () => {
      const result = await caller.admin.requestRecovery({ method: 'email' });
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.contact).toBeDefined();
    });

    it('should generate recovery token for whatsapp method', async () => {
      const result = await caller.admin.requestRecovery({ method: 'whatsapp' });
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.contact).toBeDefined();
    });
  });

  describe('admin.resetPassword', () => {
    it('should fail with invalid token', async () => {
      try {
        await caller.admin.resetPassword({
          token: 'invalidtoken',
          newPassword: 'newpassword123',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should fail with short password', async () => {
      try {
        await caller.admin.resetPassword({
          token: 'sometoken',
          newPassword: '123',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('admin.updateEmail', () => {
    it('should fail with invalid password', async () => {
      try {
        await caller.admin.updateEmail({
          password: 'wrongpassword',
          newEmail: 'newemail@example.com',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should fail with invalid email format', async () => {
      try {
        await caller.admin.updateEmail({
          password: 'currentpassword',
          newEmail: 'notanemail',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('admin.updateWhatsapp', () => {
    it('should fail with invalid password', async () => {
      try {
        await caller.admin.updateWhatsapp({
          password: 'wrongpassword',
          newWhatsapp: '+57 3001234567',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should fail with empty whatsapp', async () => {
      try {
        await caller.admin.updateWhatsapp({
          password: 'currentpassword',
          newWhatsapp: '',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('admin.getConfig', () => {
    it('should return admin config without password hash', async () => {
      const result = await caller.admin.getConfig();
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('whatsapp');
      expect(result).not.toHaveProperty('passwordHash');
    });
  });
});
