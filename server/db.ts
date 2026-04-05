import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, galleryImages, InsertGalleryImage, orders, InsertOrder, Order, adminConfig } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Gallery queries
export async function getAllGalleryImages() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get gallery images: database not available");
    return [];
  }

  try {
    return await db.select().from(galleryImages).orderBy((t) => t.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get gallery images:", error);
    throw error;
  }
}

export async function addGalleryImage(image: InsertGalleryImage) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add gallery image: database not available");
    return null;
  }

  try {
    const result = await db.insert(galleryImages).values(image);
    return result;
  } catch (error) {
    console.error("[Database] Failed to add gallery image:", error);
    throw error;
  }
}

export async function deleteGalleryImage(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete gallery image: database not available");
    return null;
  }

  try {
    return await db.delete(galleryImages).where(eq(galleryImages.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete gallery image:", error);
    throw error;
  }
}

// Orders queries
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create order: database not available");
    return null;
  }

  try {
    const result = await db.insert(orders).values(order);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    throw error;
  }
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get orders: database not available");
    return [];
  }

  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get orders:", error);
    throw error;
  }
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order: database not available");
    return null;
  }

  try {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get order:", error);
    throw error;
  }
}

export async function updateOrderStatus(id: number, status: Order["status"]) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update order: database not available");
    return null;
  }

  try {
    return await db.update(orders).set({ status }).where(eq(orders.id, id));
  } catch (error) {
    console.error("[Database] Failed to update order:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.

// Admin config queries
export async function getAdminConfig() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get admin config: database not available");
    return null;
  }

  try {
    const result = await db.select().from(adminConfig).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get admin config:", error);
    throw error;
  }
}

export async function updateAdminPassword(passwordHash: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update admin password: database not available");
    return null;
  }

  try {
    return await db.update(adminConfig).set({ passwordHash, recoveryToken: null, recoveryTokenExpiry: null });
  } catch (error) {
    console.error("[Database] Failed to update admin password:", error);
    throw error;
  }
}

export async function updateAdminEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update admin email: database not available");
    return null;
  }

  try {
    return await db.update(adminConfig).set({ email });
  } catch (error) {
    console.error("[Database] Failed to update admin email:", error);
    throw error;
  }
}

export async function updateAdminWhatsapp(whatsapp: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update admin whatsapp: database not available");
    return null;
  }

  try {
    return await db.update(adminConfig).set({ whatsapp });
  } catch (error) {
    console.error("[Database] Failed to update admin whatsapp:", error);
    throw error;
  }
}

export async function setRecoveryToken(token: string, expiryMinutes: number = 30) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot set recovery token: database not available");
    return null;
  }

  try {
    const expiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
    return await db.update(adminConfig).set({ recoveryToken: token, recoveryTokenExpiry: expiry });
  } catch (error) {
    console.error("[Database] Failed to set recovery token:", error);
    throw error;
  }
}
