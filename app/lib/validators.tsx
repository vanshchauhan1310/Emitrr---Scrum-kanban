import { title } from "process";
import { z } from "zod";

export const ProjectSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
    key: z.string().min(2, { message: "Key must be at least 2 characters" }).max(100, { message: "Key must be less than 100 characters" }),
    description: z.string().max(500, { message: "Description must be less than 500 characters" }).optional(),
})

export type ProjectSchemaType = z.infer<typeof ProjectSchema>

export const sprintSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" })
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
    }
    return true;
}, {
    message: "End date must be after start date",
    path: ["endDate"]
});

export type SprintSchemaType = z.infer<typeof sprintSchema>;

export const issueSchema = z.object({
title: z.string().min(1,"Tiltle is required"),
assigneeId: z.string().cuid("Please Select assignee"),
description: z.string().optional(),
priority: z.enum(["LOW","MEDIUM","HIGH","URGENT"]),


})

