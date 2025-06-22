import React, { Suspense } from 'react'
import { GetProject } from '@/actions/project'
import { notFound } from 'next/navigation'
import Skeleton from '@/components/ui/skeleton'
import SprintFormWrapper from '../_compoenents/sprint-form-wrapper'
import SprintBoard from '../_compoenents/sprintboard'

interface ProjectPageProps {
    params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { projectId } = await params;

    try {
        const project = await GetProject(projectId)

        if (!project) {
            return notFound()
        }

        return (
            <div className='container mx-auto'>
                <Suspense fallback={
                    <div className="w-full space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                }>
                    <SprintFormWrapper
                        projectId={projectId}
                        projectTitle={project.name}
                        projectKey={project.key}
                        sprintKey={project.sprint?.length + 1}
                    />
                </Suspense>

                {project.sprint.length > 0 ? ( 
                    <>
                        <SprintBoard
                        sprints = {project.sprint}
                        projectId = {projectId}
                        orgId={project.organizationId}
                        />
                    </>
                ) : (
                    <div className='flex flex-col items-center justify-center h-full'>
                        <h1 className='text-2xl font-bold'>No Sprints found</h1>
                        <p className='text-sm text-muted-foreground'>Create a sprint to get started</p>
                    </div>
                )}
            </div>
        )
    } catch (error) {
        console.error("Error loading project:", error);
        return notFound();
    }
}