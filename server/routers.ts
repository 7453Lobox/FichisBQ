import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllGalleryImages, addGalleryImage, deleteGalleryImage } from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  gallery: router({
    list: publicProcedure.query(async () => {
      return await getAllGalleryImages();
    }),
    upload: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          category: z.string().optional(),
          fileBase64: z.string(),
          fileName: z.string(),
          mimeType: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const buffer = Buffer.from(input.fileBase64, 'base64');
          const fileKey = `gallery/${ctx.user.id}/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(fileKey, buffer, input.mimeType);

          const result = await addGalleryImage({
            title: input.title,
            description: input.description,
            imageUrl: url,
            imageKey: fileKey,
            category: input.category,
            uploadedBy: ctx.user.id,
          });

          return { success: true, url, fileKey };
        } catch (error) {
          console.error('Gallery upload error:', error);
          throw new Error('Failed to upload image');
        }
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const images = await getAllGalleryImages();
        const targetImage = images.find(img => img.id === input.id);

        if (!targetImage) {
          throw new Error('Image not found');
        }

        if (ctx.user.role !== 'admin' && targetImage.uploadedBy !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        await deleteGalleryImage(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
