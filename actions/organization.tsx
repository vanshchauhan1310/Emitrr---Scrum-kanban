"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const getOrganization = async ({ orgId }: { orgId: string }) => {
  try {
    const client = await clerkClient();
    const organization = await client.organizations.getOrganization({ organizationId: orgId });
    return organization;
  } catch (error) {
    console.error("Error fetching organization from Clerk:", error);
    // If Clerk organization doesn't exist, try to get from database
    try {
      const dbOrganization = await db.organization.findUnique({
        where: { id: orgId }
      });
      return dbOrganization;
    } catch (dbError) {
      console.error("Error fetching organization from database:", dbError);
      return null;
    }
  }
};

export async function checkOrganizationExists(orgId: string) {
  try {
    // Check in database first
    const dbOrg = await db.organization.findUnique({
      where: { id: orgId }
    });
    
    if (dbOrg) {
      return true;
    }
    
    // Check in Clerk
    const client = await clerkClient();
    await client.organizations.getOrganization({ organizationId: orgId });
    return true;
  } catch (error) {
    return false;
  }
}

export async function cleanupDeletedOrganization(orgId: string) {
  try {
    // Delete from database if it exists
    await db.organization.deleteMany({
      where: { id: orgId }
    });
    
    // Note: We can't delete from Clerk via API, that needs to be done manually
    console.log(`Organization ${orgId} cleaned up from database`);
    return true;
  } catch (error) {
    console.error("Error cleaning up organization:", error);
    return false;
  }
}

export async function getOrganizationUsers(orgId: string) {
  const { userId } = await auth();
  const client = await clerkClient();

  if(!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const organizationMembership = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  const userids = organizationMembership.data.map(
    (membership) => membership.publicUserData?.userId
  ).filter(Boolean) as string[];

  const users = await db.user.findMany({
    where:{
      clerkUserId:{
        in:userids
      },
    },
  });

  return users;
}

export async function syncOrganizationAndMembership() {
  const { userId: clerkUserId, orgId, orgSlug, orgRole } = await auth();

  console.log("SYNCING MEMBERSHIP:", { clerkUserId, orgId, orgRole });

  if (!clerkUserId || !orgId) {
    return null;
  }

  try {
    let organization = await db.organization.findUnique({
      where: { id: orgId }
    });

    if (!organization) {
      console.log("Organization not found, creating...");
      const orgName = orgSlug ? orgSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "My Organization";
      organization = await db.organization.create({
        data: {
          id: orgId,
          name: orgName,
          adminIds: orgRole === 'org:admin' ? [clerkUserId] : []
        }
      });
      console.log("Organization created:", organization);
    } else if (orgRole === 'org:admin' && !organization.adminIds.includes(clerkUserId)) {
      console.log("User is admin in Clerk but not in DB, updating...");
      organization = await db.organization.update({
        where: { id: orgId },
        data: {
          adminIds: {
            push: clerkUserId
          }
        }
      });
      console.log("Organization updated with new admin:", organization);
    }

    return organization;
  } catch (error) {
    console.error("Error in syncOrganizationAndMembership:", error);
    // If there's an error, it might be because the organization doesn't exist in Clerk
    // In this case, we should clean up the database entry
    try {
      await db.organization.deleteMany({
        where: { id: orgId }
      });
      console.log("Cleaned up orphaned organization from database");
    } catch (cleanupError) {
      console.error("Error cleaning up organization:", cleanupError);
    }
    return null;
  }
}