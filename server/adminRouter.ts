import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAdminConfig, updateAdminPassword, updateAdminEmail, updateAdminWhatsapp, setRecoveryToken } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const adminRouter = router({
  login: publicProcedure
    .input(z.object({ password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const config = await getAdminConfig();
        if (!config) {
          throw new Error('Admin config not found');
        }

        const isValidPassword = await bcrypt.compare(input.password, config.passwordHash);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        // Set admin session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie('admin_session', 'authenticated', {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return { success: true, email: config.email, whatsapp: config.whatsapp };
      } catch (error) {
        console.error('Admin login error:', error);
        throw new Error('Login failed');
      }
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie('admin_session', { ...cookieOptions, maxAge: -1 });
    return { success: true };
  }),

  changePassword: publicProcedure
    .input(z.object({ oldPassword: z.string().min(1), newPassword: z.string().min(6) }))
    .mutation(async ({ input }) => {
      try {
        const config = await getAdminConfig();
        if (!config) {
          throw new Error('Admin config not found');
        }

        const isValidPassword = await bcrypt.compare(input.oldPassword, config.passwordHash);
        if (!isValidPassword) {
          throw new Error('Invalid current password');
        }

        const newPasswordHash = await bcrypt.hash(input.newPassword, 10);
        await updateAdminPassword(newPasswordHash);

        return { success: true };
      } catch (error) {
        console.error('Change password error:', error);
        throw new Error('Failed to change password');
      }
    }),

  requestRecovery: publicProcedure
    .input(z.object({ method: z.enum(['email', 'whatsapp']) }))
    .mutation(async ({ input }) => {
      try {
        const config = await getAdminConfig();
        if (!config) {
          throw new Error('Admin config not found');
        }

        // Generate a shorter, more user-friendly code (6 digits)
        const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
        const recoveryToken = crypto.randomBytes(32).toString('hex');
        await setRecoveryToken(recoveryToken, 30);

        // Return the code to display on screen
        return {
          success: true,
          code: recoveryCode,
          token: recoveryToken,
          contact: input.method === 'email' ? config.email : config.whatsapp,
          method: input.method,
        };
      } catch (error) {
        console.error('Recovery request error:', error);
        throw new Error('Failed to request recovery');
      }
    }),

  resetPassword: publicProcedure
    .input(z.object({ token: z.string(), newPassword: z.string().min(6) }))
    .mutation(async ({ input }) => {
      try {
        const config = await getAdminConfig();
        if (!config || config.recoveryToken !== input.token) {
          throw new Error('Invalid recovery token');
        }

        if (config.recoveryTokenExpiry && config.recoveryTokenExpiry < new Date()) {
          throw new Error('Recovery token expired');
        }

        const newPasswordHash = await bcrypt.hash(input.newPassword, 10);
        await updateAdminPassword(newPasswordHash);

        return { success: true };
      } catch (error) {
        console.error('Reset password error:', error);
        throw new Error('Failed to reset password');
      }
    }),

  updateEmail: publicProcedure
    .input(z.object({ password: z.string().min(1), newEmail: z.string().email() }))
    .mutation(async ({ input }) => {
      try {
        const config = await getAdminConfig();
        if (!config) {
          throw new Error('Admin config not found');
        }

        const isValidPassword = await bcrypt.compare(input.password, config.passwordHash);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        await updateAdminEmail(input.newEmail);
        return { success: true };
      } catch (error) {
        console.error('Update email error:', error);
        throw new Error('Failed to update email');
      }
    }),

  updateWhatsapp: publicProcedure
    .input(z.object({ password: z.string().min(1), newWhatsapp: z.string().min(1) }))
    .mutation(async ({ input }) => {
      try {
        const config = await getAdminConfig();
        if (!config) {
          throw new Error('Admin config not found');
        }

        const isValidPassword = await bcrypt.compare(input.password, config.passwordHash);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        await updateAdminWhatsapp(input.newWhatsapp);
        return { success: true };
      } catch (error) {
        console.error('Update whatsapp error:', error);
        throw new Error('Failed to update whatsapp');
      }
    }),

  getConfig: publicProcedure.query(async () => {
    try {
      const config = await getAdminConfig();
      if (!config) {
        throw new Error('Admin config not found');
      }
      // Don't return password hash
      return {
        email: config.email,
        whatsapp: config.whatsapp,
      };
    } catch (error) {
      console.error('Get config error:', error);
      throw new Error('Failed to get admin config');
    }
  }),
});
