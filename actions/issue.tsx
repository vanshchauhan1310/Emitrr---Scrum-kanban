"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { IssuePriority } from "@/lib/generated/prisma";

export async function createIssue(projectId: string, data: any){
    const { userId, orgId } = await auth();

    if(!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where:{
            clerkUserId: userId
        }
    });

    if(!user) {
        throw new Error("User not found")
    }

    const lastIssue = await db.issue.findFirst({
        where:{
            projectId: projectId,
            statusId:data.status
        },
        orderBy:{
            order: "desc"
        },
    });

    const newOrder = lastIssue ? lastIssue.order + 1 : 0;

    const issue = await db.issue.create({
        data:{
            title: data.title,
            description:data.description,
            statusId:data.status,
            priority:data.priority,
            projectId:projectId,
            sprintId:data.sprintId,
            reporterId:user.id,
            assigneeId:data.assigneeId || null,
            order: newOrder,
        },
        include:{
            assignee:true,
            reporter:true,
        },

    })

    return issue;

}

export async function getIssuesForSprint(sprintId: string) {
    const { userId, orgId } = await auth();

    if(!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const issues = await db.issue.findMany({
        where:{ sprintId },
        orderBy : [{statusId:"asc"}, {order:"asc"}],
        include:{
            assignee:true,
            reporter:true,
        },
    })

    return issues;
}


export async function updateIssueOrder(sortedIssues: any[]) {
    
    const { userId, orgId } = await auth();

    if(!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    await db.$transaction(async (prisma)=>{
        for(const issue of sortedIssues){
            await prisma.issue.update({
                where:{ id:issue.id },
                data: {
                    statusId:issue.statusId,
                    order: issue.order,
                },
            });
        }
    });


    return { success: true };
}

export async function deleteIssue(issueId: string) {

    const { userId, orgId } = await auth();

    if(!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where:{
            clerkUserId: userId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const issue = await db.issue.findUnique({
        where:{
            id: issueId
        },
        include:{
            project: {
                include: {
                    organization: true
                }
            }
        },
    });

    if (!issue || !issue.project) {
        throw new Error("Issue or project not found");
    }

    if (issue.reporterId !== user.id &&
        !issue.project.organization.adminIds.includes(user.id)
    ) {
        throw new Error("you dont have permission to delete task ");
    }

    await db.issue.delete({
        where:{
            id:issueId
        },
    })

    return {success:true};
}

export async function updateIssue(issueId:string ,data: { status?: string, priority?: string }) {

    const { userId, orgId } = await auth();

    if(!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where:{
            clerkUserId: userId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }


    try {
        const issue = await db.issue.findUnique({
            where:{
                id: issueId
            },
    
            include:{
                project: {
                    include: {
                        organization: true
                    }
                }
            },
        });

        if (!issue || !issue.project) {
            throw new Error("Issue not Found ")
        }

        if(issue.project.organization.id !== orgId){
            throw new Error("Unauthorize")
        }
        
        const updateData: { statusId?: string; priority?: IssuePriority } = {};
        if (data.status) {
            updateData.statusId = data.status;
        }
        if (data.priority) {
            updateData.priority = data.priority as IssuePriority;
        }

        const updatedIssues = await db.issue.update({
            where:{
                id:issueId
            },
            data: updateData,
            include:{
                assignee:true,
                reporter:true,
            }
        })


        return updatedIssues;
    } catch (error: any) {
        throw new Error("Error updating isssue" + error.message);
    }

}