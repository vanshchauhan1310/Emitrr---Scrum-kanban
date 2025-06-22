"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Helper to check admin
async function requireAdmin(orgId: string) {
  const { userId: clerkUserId } = await auth(); // Explicitly name it clerkUserId
  if (!clerkUserId) throw new Error("Unauthorized");

  // Fetch the organization
  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { adminIds: true } // Only select the adminIds for efficiency
  });

  if (!org || !org.adminIds || !org.adminIds.includes(clerkUserId)) {
    // Check if org exists, if adminIds array exists, and if it includes the user's Clerk ID
    throw new Error("Only admins can manage columns");
  }
}

export async function getStatuses(orgId: string) {
  return db.status.findMany({ where: { organizationId: orgId } });
}

export async function createStatus(orgId: string, data: { name: string; key: string }) {
  await requireAdmin(orgId);
  return db.status.create({
    data: { ...data, organizationId: orgId }
  });
}

export async function updateStatus(orgId: string, statusId: string, data: { name?: string; key?: string }) {
  await requireAdmin(orgId);
  return db.status.update({
    where: { id: statusId },
    data,
  });
}

export async function deleteStatus(orgId: string, statusId: string) {
  await requireAdmin(orgId);
  await db.status.delete({ where: { id: statusId } });
  return { success: true };
}