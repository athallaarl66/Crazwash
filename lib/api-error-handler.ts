// lib/api-error-handler.ts
/**
 * Error handler untuk API routes.
 * Memastikan SELALU return JSON, bukan HTML error page.
 */

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

/** Error carrying an HTTP status; handleAPIError turns it into a JSON response. */
function httpError(message: string, status: number) {
  const error = new Error(message) as Error & { status: number };
  error.status = status;
  return error;
}

export interface APIErrorResponse {
  error: string;
  details?: unknown;
  code?: string;
  timestamp: string;
}

export function handleAPIError(error: unknown): NextResponse<APIErrorResponse> {
  console.error("API Error:", error);

  const timestamp = new Date().toISOString();

  // 1. Zod Validation Error
  //    .issues adalah the properly typed property.
  //    .errors is a getter yang kadang tidak resolve di strict TS.
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
        code: "VALIDATION_ERROR",
        timestamp,
      },
      { status: 400 },
    );
  }

  // 2. Prisma Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const field = (error.meta?.target as string[]) || [];
      return NextResponse.json(
        {
          error: `${field.join(", ")} sudah digunakan`,
          code: "UNIQUE_CONSTRAINT",
          timestamp,
        },
        { status: 409 },
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Data tidak ditemukan",
          code: "NOT_FOUND",
          timestamp,
        },
        { status: 404 },
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error: "Data terkait dengan data lain yang masih digunakan",
          code: "FOREIGN_KEY_CONSTRAINT",
          timestamp,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Database error",
        code: error.code,
        timestamp,
      },
      { status: 500 },
    );
  }

  // 3. Prisma Validation Error
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      {
        error: "Invalid data format",
        code: "VALIDATION_ERROR",
        timestamp,
      },
      { status: 400 },
    );
  }

  // 4. Custom Error dengan status property
  if (error instanceof Error && "status" in error) {
    const status = (error as Error & { status: number }).status || 500;
    return NextResponse.json(
      {
        error: error.message,
        code: "CUSTOM_ERROR",
        timestamp,
      },
      { status },
    );
  }

  // 5. Standard Error
  if (error instanceof Error) {
    const message =
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error";

    return NextResponse.json(
      {
        error: message,
        code: "INTERNAL_ERROR",
        timestamp,
      },
      { status: 500 },
    );
  }

  // 6. Unknown
  return NextResponse.json(
    {
      error: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
      timestamp,
    },
    { status: 500 },
  );
}

// ============================================
// WRAPPER untuk API Routes
// ============================================

type APIHandler = (
  request: Request,
  context?: { params?: Record<string, string> },
) => Promise<NextResponse> | NextResponse;

export function withErrorHandler(handler: APIHandler): APIHandler {
  return async (request: Request, context?) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

// ============================================
// SUCCESS RESPONSE HELPERS
// ============================================

export function successResponse<T>(
  data: T,
  status: number = 200,
): NextResponse {
  return NextResponse.json(data, { status });
}

export function createdResponse<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 201 });
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// ============================================
// AUTH HELPERS
// ============================================

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw httpError("Unauthorized", 401);
  }

  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role)) {
    throw httpError("Forbidden - Insufficient permissions", 403);
  }

  return session;
}

/**
 * The single administrative guard. Routes and server actions call this instead of
 * reading the role cached in the session, because the session's role is written at
 * sign-in time: a demoted administrator would otherwise keep access until the
 * token expires. Role, enabled state and removal state are read from storage on
 * every call, so the next request after a change already fails.
 */
export async function requireAdmin() {
  const session = await requireAuth();

  const userId = Number(session.user.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw httpError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      deletedAt: true,
    },
  });

  if (!user || !user.isActive || user.deletedAt) {
    throw httpError("Unauthorized", 401);
  }

  if (user.role !== "ADMIN") {
    throw httpError("Forbidden - Administrator role required", 403);
  }

  return {
    session,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

/**
 * Route-handler adapter for the administrative guard: returns the authorization
 * response when the caller is not an administrator, and null when the request may
 * proceed. Each route keeps its own error handling for the work that follows.
 */
export async function adminGuardResponse(): Promise<NextResponse | null> {
  try {
    await requireAdmin();
    return null;
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Server-action adapter for the administrative guard: returns the failure result
 * the action reports to its caller, or null when the action may proceed. Used so a
 * rejected action returns a value the UI can show instead of throwing into the
 * framework's error path.
 */
export async function adminGuardResult(): Promise<{
  success: false;
  error: string;
} | null> {
  try {
    await requireAdmin();
    return null;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }
}
