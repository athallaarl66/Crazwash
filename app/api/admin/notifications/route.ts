// app/api/admin/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleAPIError, requireAdmin } from "@/lib/api-error-handler";

// GET: Fetch notifications untuk admin
export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const userId = user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit 50 terbaru
    });

    return NextResponse.json(notifications);
  } catch (error) {
    return handleAPIError(error);
  }
}

// POST: Mark as read atau mark all as read
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const userId = user.id;

    const body = await request.json();
    const { action, notificationId } = body;

    if (action === "markAsRead" && notificationId) {
      await prisma.notification.update({
        where: { id: notificationId, userId },
        data: { read: true },
      });
    } else if (action === "markAllAsRead") {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAPIError(error);
  }
}
