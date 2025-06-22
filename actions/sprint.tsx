"use server"

import { auth } from "@clerk/nextjs/server"
import { sprintSchema } from "@/app/lib/validators"
import { db } from "@/lib/prisma"
import { SprintStatus } from "@/lib/generated/prisma"
import { _success } from "zod/v4/core"

interface CreateSprintData {
    name: string;
    startDate: Date;
    endDate: Date;
    status: SprintStatus;
}

export async function createSprint(projectId: string, data: CreateSprintData) {
    try {
        const { userId, orgId } = await auth()

        if (!userId || !orgId) {
            throw new Error("Unauthorized")
        }

        const project = await db.project.findUnique({
            where: {
                id: projectId
            },
        })

        if(!project || project.organizationId !== orgId){
            throw new Error("Project not found")
        }

        const sprint = await db.sprint.create({
            data: {
                name: data.name,
                startDate: data.startDate,
                endDate: data.endDate,
                status: data.status,
                projectId,
            }
        })

        return { success: true, data: sprint };
    } catch (error) {
        console.error("Sprint creation error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create sprint" };
    }
}

export async function updateSprintStatus(sprintId: string, newStatus:string) {

    const { userId , orgId , orgRole} = await auth()

    if (!userId || !orgId) {
        throw new Error("Unauthorized")
    }

    try{
        const sprint = await db.sprint.findUnique({
            where:{
                id: sprintId
            },

            include:{
                project:true
            }
        });


        if(!sprint){
            throw new Error("sprint not found")
        }

        if(sprint.project.organizationId !== orgId){
            throw new Error("unauthorized");

        }

        if(orgRole !== "org:admin"){
            throw new Error("Only Admin can make this change ")

        }

        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);
        const now = new Date();


        if(newStatus === "ACTIVE" && (now<startDate || now > endDate)){
            throw new Error("Cannot start sprint outside of its date Range")
        }

        if(newStatus === "COMPLETED" && sprint.status!== "ACTIVE"){
            throw new Error("Can ONLY complete Active sprit")
        }

        const updateSprint = await db.sprint.update({
            where: {
                id: sprintId
            },

            data:{
                status: newStatus
            },
        });

        return {success:true,sprint:updateSprint}

    }catch (error){
        throw new Error(error.message);
    }


}
