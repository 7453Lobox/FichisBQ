import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appRouter } from './routers';
import { TRPCError } from '@trpc/server';

// Mock database functions
vi.mock('./db', () => ({
  createOrder: vi.fn(async (order) => {
    return { id: 1, ...order };
  }),
  getAllOrders: vi.fn(async () => [
    {
      id: 1,
      customerName: 'Juan',
      customerPhone: '573001234567',
      items: '[{"nombre":"Carne","cantidad":1,"precio":50000}]',
      totalPrice: 5000000,
      paymentMethod: 'whatsapp',
      status: 'nuevo',
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  updateOrderStatus: vi.fn(async (id, status) => {
    return { success: true };
  }),
}));

describe('Orders Router', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    // Create a public context for testing
    const ctx = {
      user: null,
      req: {} as any,
      res: {} as any,
    };
    caller = appRouter.createCaller(ctx);
  });

  describe('orders.create', () => {
    it('should create an order with valid input', async () => {
      const result = await caller.orders.create({
        customerName: 'Juan',
        customerPhone: '573001234567',
        items: '[{"nombre":"Carne","cantidad":1,"precio":50000}]',
        totalPrice: 5000000,
        paymentMethod: 'whatsapp',
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Order created successfully');
    });

    it('should fail with empty customer name', async () => {
      try {
        await caller.orders.create({
          customerName: '',
          customerPhone: '573001234567',
          items: '[{"nombre":"Carne","cantidad":1,"precio":50000}]',
          totalPrice: 5000000,
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
      }
    });

    it('should fail with empty phone number', async () => {
      try {
        await caller.orders.create({
          customerName: 'Juan',
          customerPhone: '',
          items: '[{"nombre":"Carne","cantidad":1,"precio":50000}]',
          totalPrice: 5000000,
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
      }
    });

    it('should fail with negative total price', async () => {
      try {
        await caller.orders.create({
          customerName: 'Juan',
          customerPhone: '573001234567',
          items: '[{"nombre":"Carne","cantidad":1,"precio":50000}]',
          totalPrice: -100,
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
      }
    });
  });

  describe('orders.list', () => {
    it('should return a list of orders', async () => {
      const result = await caller.orders.list();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('customerName');
      expect(result[0]).toHaveProperty('totalPrice');
      expect(result[0]).toHaveProperty('status');
    });
  });

  describe('orders.updateStatus', () => {
    it('should fail without authentication', async () => {
      try {
        await caller.orders.updateStatus({
          orderId: 1,
          status: 'listo',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError<any>).code).toBe('UNAUTHORIZED');
      }
    });

    it('should fail if user is not admin', async () => {
      const ctx = {
        user: { id: 1, role: 'user', openId: 'test' },
        req: {} as any,
        res: {} as any,
      };
      const userCaller = appRouter.createCaller(ctx);

      try {
        await userCaller.orders.updateStatus({
          orderId: 1,
          status: 'listo',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
      }
    });

    it('should update order status for admin user', async () => {
      const ctx = {
        user: { id: 1, role: 'admin', openId: 'test' },
        req: {} as any,
        res: {} as any,
      };
      const adminCaller = appRouter.createCaller(ctx);

      const result = await adminCaller.orders.updateStatus({
        orderId: 1,
        status: 'listo',
      });

      expect(result.success).toBe(true);
    });

    it('should accept all valid status values', async () => {
      const ctx = {
        user: { id: 1, role: 'admin', openId: 'test' },
        req: {} as any,
        res: {} as any,
      };
      const adminCaller = appRouter.createCaller(ctx);

      const statuses = ['nuevo', 'en_preparacion', 'listo', 'entregado', 'cancelado'] as const;

      for (const status of statuses) {
        const result = await adminCaller.orders.updateStatus({
          orderId: 1,
          status,
        });
        expect(result.success).toBe(true);
      }
    });
  });
});
