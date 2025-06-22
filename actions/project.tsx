"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { db } from "@/lib/prisma";

export const createProject = async (data: any) => {
    const { userId, orgId} = await auth()
    const userAuth = await auth();
    const { slug } = data;

    if (!userId || !orgId) {
        throw new Error("Unauthorized")
    }
    // get organization
    const client = await clerkClient();
    const organization = await client.organizations.getOrganization({
        slug,
      });

    const { data: membership } = await client.organizations.getOrganizationMembershipList({
        organizationId: organization.id,
      });
    
      const userMembership = membership.find((member: any) => member.publicUserData?.userId === userAuth.userId);
    
      // check if user is admin
      if (!userMembership || userMembership.role !== "org:admin") {
        throw new Error("only admins can create projects")
      }

      try{
        const project = await db.project.create({
            data: {
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId,
            }
        })
        return project;
      } catch (error) {
        throw new Error("Failed to create project")
      }
 
}

export const getProject = async (orgId: string) => {
    const { userId} = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) {
        throw new Error("User not found")
    }


    const project = await db.project.findMany({
        where: {
            organizationId: orgId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return project
}

export const deleteProject = async (projectId: string) => {
    const { userId , orgId , orgRole} = await auth()

    if (!userId || !orgId) {
        throw new Error("Unauthorized")
    }

    if (orgRole !== "org:admin") {
        throw new Error("Only admins can delete projects")
    }


    const project = await db.project.findUnique({
        where: {
            id: projectId
        }
    })


    if (!project || project.organizationId !== orgId) {
        throw new Error("Project not found or you are not authorized to delete this project")
    }

    await db.project.delete({
        where: {
            id: projectId
        }
    })

    return {
        success: true,
        message: "Project deleted successfully"
    }

}

export const GetProject = async (projectId: string) => {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    const { userId, orgId} = await auth()

    if (!userId || !orgId) {
        throw new Error("Unauthorized")
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) {
        throw new Error("User not found")
    }

    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        include: {
            sprint: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    if (!project) {
        throw new Error("Project not found")
    }

    if (project.organizationId !== orgId) {
        throw new Error("Project not found")
    }

    return project
}
