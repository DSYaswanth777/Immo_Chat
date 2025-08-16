import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
});

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await context.params; // await params
    const currentUserId = (session.user as any).id;
    const currentUserRole = (session.user as any).role;

    if (userId !== currentUserId && currentUserRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        company: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            properties: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await context.params;
    const currentUserId = (session.user as any).id;
    const currentUserRole = (session.user as any).role;

    // Users can only update their own profile unless they're admin
    if (userId !== currentUserId && currentUserRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Only admins can change roles
    if (validatedData.role && currentUserRole !== "ADMIN") {
      delete validatedData.role;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        company: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (Admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete users
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: userId } = await context.params;
    const currentUserId = (session.user as any).id;

    // Prevent admin from deleting themselves
    if (userId === currentUserId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
