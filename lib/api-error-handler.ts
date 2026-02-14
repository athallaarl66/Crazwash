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
    const error = new Error("Unauthorized") as Error & { status: number };
    error.status = 401;
    throw error;
  }

  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role)) {
    const error = new Error("Forbidden - Insufficient permissions") as Error & {
      status: number;
    };
    error.status = 403;
    throw error;
  }

  return session;
}
