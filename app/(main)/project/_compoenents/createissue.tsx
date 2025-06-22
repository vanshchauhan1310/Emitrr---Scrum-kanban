"use client"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"

  import { Button } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getOrganizationUsers } from "@/actions/organization"
import { createIssue } from "@/actions/issue"
import { useEffect } from "react"
import { BarLoader } from "react-spinners"
import { Input } from "@/components/ui/input"
import MDEditor from '@uiw/react-md-editor';
import * as z from "zod";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import useFetch from "@/hooks/use-fetch"
import { User } from "@/lib/generated/prisma"

const issueSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().optional(),
    assigneeId: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
})

type IssueFormData = z.infer<typeof issueSchema>;

interface IssueCreationDrawerProps {
    isOpen: boolean;
    onclose: () => void;
    sprintId: string;
    status: string;
    projectId: string;
    onIssueCreated: () => void;
    orgId: string; 
}


const IssueCreationDrawer = ({
    isOpen,
    onclose,
    sprintId,
    status,
    projectId,
    onIssueCreated,
    orgId, 
}: IssueCreationDrawerProps) =>{

   const {
    control,
    register,
    handleSubmit,
    formState:{ errors },
    reset 
    
   }= useForm<IssueFormData>({
        resolver: zodResolver(issueSchema),
         defaultValues:{
            priority: "MEDIUM",
         },
    })


    const {
        fetchData: createIssueFn,
        isLoading: createIssueLoading,
        error: createError,
        data: newIssue,
    } = useFetch(createIssue)

    useEffect(()=>{
        if (newIssue) {
            reset();
            onclose();
            onIssueCreated();
            toast.success("Issue Added Succesfully")
        }

    },[newIssue, onIssueCreated, onclose, reset])


    const {
        fetchData: fetchuser,
        isLoading: userLoading,
        data: users,
    } = useFetch(getOrganizationUsers)

    useEffect(()=>{
        if (isOpen && orgId) {
            fetchuser(orgId)   
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isOpen, orgId])

    const onSubmit = async (data: IssueFormData) => {

        await createIssueFn(projectId,{
            ...data,
            status,
            sprintId,
        })
    };

     

return <Drawer open={isOpen} onClose={onclose}>
<DrawerContent>
  <DrawerHeader>
    <DrawerTitle>Create New Issue</DrawerTitle>
  </DrawerHeader>

  {userLoading && <BarLoader width={"100%"} color="#36d7b7" />}

  <div className="overflow-y-auto max-h-[80vh]">
    <form className="p-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
            </label>

            <Input id="title" {...register("title")} />
            {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                </p>
            )}
 
        </div>

        <div>
            <label htmlFor="assigneeId" className="block text-sm font-medium mb-1">
                Assignee
            </label>

    <Controller name="assigneeId" control={control} 
        render={({field}) =>(
        <Select
        onValueChange={field.onChange}
        defaultValue={field.value}>
            <SelectTrigger>
                <SelectValue placeholder="Select assignee"></SelectValue>
            </SelectTrigger>
            <SelectContent>
                {Array.isArray(users) && users?.map((user: any)=>{
                    return <SelectItem key={user.id} value={user.id}>
                        {user?.name}
                    </SelectItem>
                })}
            </SelectContent>
        </Select>
    )}
    />
       {errors.assigneeId && (
          <p className="text-red-500 text-sm mt-1">
               {errors.assigneeId.message}
          </p>
        )}
        </div>


        <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
            </label>

            <Controller name="description" control={control} 
        render={({field}) =>(

            <MDEditor
            value={field.value}
            onChange={field.onChange}
          />

        )}
        />

            {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                </p>
            )}
 
        </div>


        <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
                Priority
            </label>

    <Controller name="priority" control={control} 
        render={({field}) =>(
        <Select
        onValueChange={field.onChange}
        defaultValue={field.value}>
            <SelectTrigger>
                <SelectValue placeholder="Select priority"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>                
            </SelectContent>
        </Select>
    )}
    />
        </div>

{createError && <p className="text-red-500 mt-2">{createError}</p>}
<Button
type="submit"
disabled={createIssueLoading}
className="w-full"
>
    {createIssueLoading ? "Creating..." : "Create Issue" }{" "}
</Button>
    </form>
  </div>
</DrawerContent>
</Drawer>

}

export default IssueCreationDrawer;