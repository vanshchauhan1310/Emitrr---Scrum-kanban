"use client"
import React from 'react'
import { useOrganization } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { deleteProject } from '@/actions/project'
import useFetch from '@/hooks/use-fetch'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'


const DeleteProject = ({projectId}: {projectId: string}) => {
    const {membership} = useOrganization()
    const router = useRouter()

    const {
        fetchData: deleteProjectFn,
         isLoading: isDeleting,
          error, 
          data: deleted,
           setData
        } = useFetch(deleteProject)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        if(window.confirm("Are you sure you want to delete this project?")) {
            deleteProjectFn(projectId)
        }
    }

    useEffect(() => {
        if(deleted?.success) {
            toast.success("Project deleted successfully")
            router.refresh()
        }
    }, [deleted, router])

    const isAdmin = membership?.role === "org:admin"

    if (!isAdmin) {
        return null
    }

  return (
    <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="hover:bg-red-500/20 hover:text-red-400 transition-colors"
    >
        <Trash2Icon className="w-4 h-4" />
    </Button>
  )
}

export default DeleteProject