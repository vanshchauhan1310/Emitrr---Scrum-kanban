"use client"
import React, { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSprint } from '@/actions/sprint'
import { addDays, format } from "date-fns"
import { CardContent, Card} from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { useRouter } from 'next/navigation'
import { sprintSchema } from '@/app/lib/validators'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { type DateRange } from 'react-day-picker'
import { SprintStatus } from '@/lib/generated/prisma'
import { z } from 'zod'

interface SprintCreationFormProps {
  projectId: string;
  projectTitle: string;
  projectKey: string;
  sprintKey: number;
}

type FormData = z.infer<typeof sprintSchema>

const SprintCreationForm = ({ projectId, projectTitle, projectKey, sprintKey }: SprintCreationFormProps) => {
    const [showForm, setShowForm] = useState(false)
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 14)
    })
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const {register, handleSubmit, formState:{errors}, control, setValue} = useForm<FormData>({
        resolver: zodResolver(sprintSchema),
        defaultValues:{
            name: `${projectKey}-${sprintKey}`,
            startDate: dateRange?.from,
            endDate: dateRange?.to
        }
    })

    const onSubmit = useCallback(async (data: FormData) => {
        if (!dateRange?.from || !dateRange?.to) {
            toast.error("Please select a date range");
            return;
        }
        
        try {
            setIsLoading(true);
            const result = await createSprint(projectId, {
                name: data.name,
                startDate: dateRange.from,
                endDate: dateRange.to,
                status: SprintStatus.PLANNED
            });

            if (!result.success) {
                throw new Error(result.error || "Failed to create sprint");
            }

            setShowForm(false);
            toast.success("Sprint Created Successfully");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create sprint");
            console.error("Sprint creation error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [dateRange, projectId, router]);

    const handleDateSelect = useCallback((range: DateRange | undefined) => {
        if (range?.from && range?.to) {
            setDateRange(range);
            setValue('startDate', range.from);
            setValue('endDate', range.to);
        }
    }, [setValue]);

    return (
        <>
            <div className='flex justify-between'>
                <h1 className='text-5xl font-bold mb-8 gradient-title'>{projectTitle}</h1>
                <Button 
                    className="mt-2" 
                    onClick={() => setShowForm(!showForm)} 
                    variant={showForm ? "destructive" : "default"}
                >
                    {showForm ? "Cancel" : "Create New Sprint"}
                </Button>
            </div>

            {showForm && (
                <Card className='pt-4 mb-4'>
                    <CardContent>
                        <form className='flex gap-4 items-end' onSubmit={handleSubmit(onSubmit)}>
                            <div className='flex-1'>
                                <label htmlFor='name'>Sprint Name</label>
                                <Input 
                                    id="name" 
                                    placeholder={`${projectKey}-${sprintKey}`}
                                    className="bg-slate-900"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div className='flex-1'>
                                <label htmlFor='dateRange'>Sprint Duration</label>
                                <Controller 
                                    control={control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button 
                                                    variant="outline"
                                                    className='w-full justify-start text-left font-normal bg-slate-900'
                                                >
                                                    <CalendarIcon className='mr-2 h-4 w-4'/>
                                                    {dateRange?.from && dateRange?.to ? (
                                                        format(dateRange.from, "LLL dd, y") + " - " + format(dateRange.to, "LLL dd, y")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent 
                                                className='w-auto p-0 bg-slate-900'
                                                align='start'
                                            >
                                                <DayPicker
                                                    mode='range'
                                                    selected={dateRange}
                                                    onSelect={handleDateSelect}
                                                    className="p-3 bg-slate-900 rounded-md border border-slate-700"
                                                    classNames={{
                                                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                                        month: "space-y-4",
                                                        caption: "flex justify-center pt-1 relative items-center",
                                                        caption_label: "text-sm font-medium text-white",
                                                        nav: "space-x-1 flex items-center",
                                                        nav_button: "h-7 w-7 bg-slate-800 p-0 hover:bg-slate-700 text-white rounded-md",
                                                        nav_button_previous: "absolute left-1",
                                                        nav_button_next: "absolute right-1",
                                                        table: "w-full border-collapse space-y-1",
                                                        head_row: "flex",
                                                        head_cell: "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
                                                        row: "flex w-full mt-2",
                                                        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                                        day: "h-9 w-9 p-0 font-normal text-slate-300 hover:bg-slate-800 hover:text-white rounded-md",
                                                        day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                                                        day_today: "border-2 border-blue-700",
                                                        day_outside: "text-slate-500 opacity-50",
                                                        day_disabled: "text-slate-500 opacity-50",
                                                        day_range_middle: "bg-blue-300",
                                                        day_range_start: "bg-blue-700",
                                                        day_range_end: "bg-blue-700",
                                                        day_hidden: "invisible",
                                                    }}
                                                    // components={{
                                                    //     IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-white" />,
                                                    //     IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-white" />
                                                    // }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                            </div>

                            <Button type='submit' disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Sprint"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default SprintCreationForm