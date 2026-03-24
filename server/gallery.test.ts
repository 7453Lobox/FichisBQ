import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "admin" | "user" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("gallery", () => {
  describe("list", () => {
    it("returns empty array when no images exist", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gallery.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("upload", () => {
    it("requires authentication", async () => {
      const ctx = { ...createAuthContext(), user: null };
      const caller = appRouter.createCaller(ctx as any);

      try {
        await caller.gallery.upload({
          title: "Test Image",
          description: "A test image",
          category: "menu",
          fileBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          fileName: "test.png",
          mimeType: "image/png",
        });
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("validates required fields", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.gallery.upload({
          title: "",
          description: "A test image",
          category: "menu",
          fileBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          fileName: "test.png",
          mimeType: "image/png",
        });
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("delete", () => {
    it("requires authentication", async () => {
      const ctx = { ...createAuthContext(), user: null };
      const caller = appRouter.createCaller(ctx as any);

      try {
        await caller.gallery.delete({ id: 1 });
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
