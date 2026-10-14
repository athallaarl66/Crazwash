// tests/order-creation.test.ts
import assert from "node:assert/strict";
import test from "node:test";

/**
 * Exercises the single order-creation path against a real database. The suite is
 * skipped when DATABASE_URL is absent, because `lib/prisma` refuses to build a
 * client without it. Every row this test writes is identified by the numbers it
 * generated and deleted again in the same test.
 */
const database = process.env.DATABASE_URL;

test(
  "two orders created in the same millisecond are both stored",
  {
    skip: database
      ? false
      : "DATABASE_URL is not set: the order-creation path is not exercised here",
  },
  async () => {
    const { prisma } = await import("../lib/prisma");
    const { createOrder } = await import("../lib/orderService");

    // Freeze the clock so both creations demonstrably share one millisecond: the
    // order number must not depend on time for its uniqueness.
    const RealDate = globalThis.Date;
    const frozen = RealDate.now();
    class FrozenDate extends RealDate {
      constructor(value?: string | number | Date) {
        super(value === undefined ? frozen : value);
      }
      static now(): number {
        return frozen;
      }
    }
    globalThis.Date = FrozenDate as unknown as DateConstructor;

    const createdOrderIds: number[] = [];
    const createdNumbers: string[] = [];

    try {
      const service = await prisma.product.findFirst({
        where: { isActive: true, deletedAt: null },
        orderBy: { id: "asc" },
      });
      assert.ok(service, "the database has no active service to order");

      const input = {
        customerName: "Verify Order Number",
        customerPhone: "081200000001",
        address: "Jl. Verification No. 1",
        services: [{ serviceId: service.id, shoesQty: 2 }],
      };

      const [first, second] = await Promise.all([
        createOrder(input),
        createOrder(input),
      ]);

      createdOrderIds.push(first.id, second.id);
      createdNumbers.push(first.orderNumber, second.orderNumber);

      assert.notEqual(
        first.orderNumber,
        second.orderNumber,
        "both creations produced the same order number",
      );

      const stored = await prisma.order.findMany({
        where: { id: { in: createdOrderIds } },
        include: { services: true },
      });

      assert.equal(
        stored.length,
        2,
        "an order was lost to a duplicate order number",
      );
      assert.equal(
        new Set(stored.map((order) => order.orderNumber)).size,
        2,
        "two stored orders share an order number",
      );

      const [storedOrder] = stored;
      assert.equal(
        Number(storedOrder.totalPrice),
        Number(service.price) * 2,
        "the stored total does not match the service price",
      );
      assert.equal(storedOrder.services.length, 1);
      assert.equal(storedOrder.services[0].shoesQty, 2);

      const history = storedOrder.statusHistory as {
        status?: string;
        note?: string;
      }[];
      assert.equal(history.length, 1);
      assert.equal(history[0]?.status, "PENDING");
      assert.match(
        history[0]?.note ?? "",
        /menunggu konfirmasi pembayaran/,
        "the status history entry is missing",
      );
    } finally {
      globalThis.Date = RealDate;

      if (createdOrderIds.length > 0) {
        await prisma.notification.deleteMany({
          where: {
            title: { in: createdNumbers.map((n) => `Pesanan baru ${n}`) },
          },
        });
        await prisma.orderService.deleteMany({
          where: { orderId: { in: createdOrderIds } },
        });
        await prisma.order.deleteMany({
          where: { id: { in: createdOrderIds } },
        });
      }

      await prisma.$disconnect();
    }
  },
);
