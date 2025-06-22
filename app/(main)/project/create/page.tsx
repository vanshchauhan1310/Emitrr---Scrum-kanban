"use client"
import React, { useEffect, useState } from 'react'
import { useOrganization } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { InfoIcon } from 'lucide-react'
import { ProjectSchema, ProjectSchemaType } from '@/app/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/use-fetch'
import { createProject } from '@/actions/project'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'



const CreateProjectpage = () => {
    const {isLoaded: isOrgLoaded, organization, membership} = useOrganization()
    const {isLoaded: isUserLoaded, user} = useUser()
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    // form state and validation
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(ProjectSchema),
    })
    

    // check if user is admin
    useEffect(() => {
        if (isOrgLoaded && isUserLoaded && organization && membership) {
            setIsAdmin(membership.role === "org:admin");
        } else {
            console.log("Conditions not met - setting isAdmin to false");
            setIsAdmin(false);
        }
    }, [isOrgLoaded, isUserLoaded, organization, membership, user?.id])

    // create project function
    const {fetchData: createProjectFn, isLoading, error, data: project, setData} = useFetch(createProject)

    useEffect(() => {
        if (project) {  
            toast.success("Project created successfully")
            router.push(`/project/${project.id}`)
        }
    }, [project, router])

    // if organization is not loaded, show loading state
    if (!isOrgLoaded || !isUserLoaded) {
        console.log("Loading state - returning null");
        return null
    }

    if (!organization) {
        return (
            <div className="flex flex-col gap-2 items-center">
                <span className='text-2xl font-bold gradient-title'>
                    <InfoIcon className='w-4 h-4' />
                    Please select an organization to create a project.
                </span>
            </div>
        )
    }

    // on submit function
    const onSubmit = async (data: ProjectSchemaType) => {
        createProjectFn({
            ...data,
            slug: organization?.slug
        })
    }



    // if user is not admin, show error
    if (!isAdmin) {
        return (
            <div className='flex flex-col gap-2 items-center'>
                <span className='text-2xl font-bold gradient-title'>
                    <InfoIcon className='w-4 h-4' />
                    You are not authorized to create a project. Only admins can create projects.
                </span>
            </div>
        )
    }

    return (
        <div className='container mx-auto py-10'>
          <h1 className='text-6xl text-center font-bold gradient-title mb-8'>Create New Project</h1>  
           
           <form className='flex flex-col space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Input
                id="name"
                className='bg-slate-900'
                placeholder='Project Name'
                {...register("name")}
                />
                {errors.name && (
                    <p className='text-red-500'>{errors.name.message}</p>
                )}
            </div>

            <div>
                <Input
                id="key"
                className='bg-slate-900'
                placeholder='Enter the Sprint name Ex: sprint-1'
                {...register("key")}
                />
                {errors.key && (
                    <p className='text-red-500'>{errors.key.message}</p>
                )}
            </div>

            <div>
                <Textarea
                id="description"
                className='bg-slate-900'
                placeholder='Enter the Project Description'
                {...register("description")}
                />
                {errors.description && (
                    <p className='text-red-500'>{errors.description.message}</p>
                )}
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
            </Button>
           </form>
            
        </div>
    )
}

export default CreateProjectpage