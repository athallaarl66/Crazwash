// lib/audit.ts
import { prisma } from "./prisma";
import { AuditAction, Role, Prisma } from "@prisma/client";

interface AuditLogInput {
  userId?: number | null;
  userEmail: string;
  userRole: Role | string;
  action: AuditAction | string;
  entity: string;
  entityId?: string;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(input: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        userEmail: input.userEmail,
        userRole: input.userRole as Role,
        action: input.action as AuditAction,
        entity: input.entity,
        entityId: input.entityId,

        changes: input.changes
          ? (input.changes as Prisma.InputJsonValue)
          : Prisma.JsonNull,

        metadata: input.metadata
          ? (input.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull,

        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log audit:", error);
  }
}

// ============================================
// PREPARE CHANGES (before / after diff)
// ============================================

export function prepareChanges(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
): {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
} {
  const changes: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  } = {};

  const sanitizedBefore = sanitizeData(before);
  const sanitizedAfter = sanitizeData(after);

  if (sanitizedBefore) changes.before = sanitizedBefore;
  if (sanitizedAfter) changes.after = sanitizedAfter;

  return changes;
}

function sanitizeData(
  data: Record<string, unknown> | null,
): Record<string, unknown> | undefined {
  if (!data) return undefined;

  const sensitiveFields = ["password"];
  const sanitized: Record<string, unknown> = { ...data };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]";
    }
  }

  return sanitized;
}

// ============================================
// TYPED AUDIT HELPERS
// ============================================

export async function auditProductChange(
  action:
    | "PRODUCT_CREATED"
    | "PRODUCT_UPDATED"
    | "PRODUCT_DELETED"
    | "PRODUCT_RESTORED",
  productId: number,
  userId: number,
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  },
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, role: true },
  });

  if (!user) return;

  await logAudit({
    userId,
    userEmail: user.email,
    userRole: user.role,
    action,
    entity: "Product",
    entityId: productId.toString(),
    changes,
  });
}

export async function auditOrderChange(
  action:
    | "ORDER_CREATED"
    | "ORDER_UPDATED"
    | "ORDER_STATUS_CHANGED"
    | "ORDER_CANCELLED",
  orderId: number,
  userId: number,
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  },
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, role: true },
  });

  if (!user) return;

  await logAudit({
    userId,
    userEmail: user.email,
    userRole: user.role,
    action,
    entity: "Order",
    entityId: orderId.toString(),
    changes,
  });
}

export async function auditUserChange(
  action: "USER_CREATED" | "USER_UPDATED" | "USER_DELETED" | "ROLE_CHANGED",
  targetUserId: number,
  actorUserId: number,
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  },
) {
  const actor = await prisma.user.findUnique({
    where: { id: actorUserId },
    select: { email: true, role: true },
  });

  if (!actor) return;

  await logAudit({
    userId: actorUserId,
    userEmail: actor.email,
    userRole: actor.role,
    action,
    entity: "User",
    entityId: targetUserId.toString(),
    changes,
  });
}

// ============================================
// QUERY AUDIT LOGS
// ============================================

export async function getAuditLogs(filters?: {
  userId?: number;
  action?: AuditAction;
  entity?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.AuditLogWhereInput = {};

  if (filters?.userId) where.userId = filters.userId;
  if (filters?.action) where.action = filters.action;
  if (filters?.entity) where.entity = filters.entity;

  if (filters?.startDate || filters?.endDate) {
    where.timestamp = {};
    if (filters.startDate) where.timestamp.gte = filters.startDate;
    if (filters.endDate) where.timestamp.lte = filters.endDate;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
      orderBy: { timestamp: "desc" },
      take: filters?.limit ?? 50,
      skip: filters?.offset ?? 0,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}

// ============================================
// EXPORT AUDIT LOGS → CSV
// ============================================

export async function exportAuditLogs(filters?: {
  startDate?: Date;
  endDate?: Date;
}) {
  const logs = await prisma.auditLog.findMany({
    where: {
      timestamp: {
        gte: filters?.startDate,
        lte: filters?.endDate,
      },
    },
    include: {
      user: {
        select: { email: true, name: true, role: true },
      },
    },
    orderBy: { timestamp: "desc" },
  });

  const csv = [
    [
      "Timestamp",
      "User",
      "Role",
      "Action",
      "Entity",
      "Entity ID",
      "IP Address",
    ].join(","),
    ...logs.map((log) =>
      [
        log.timestamp.toISOString(),
        log.user?.email || log.userEmail,
        log.userRole,
        log.action,
        log.entity,
        log.entityId || "",
        log.ipAddress || "",
      ].join(","),
    ),
  ].join("\n");

  return csv;
}
