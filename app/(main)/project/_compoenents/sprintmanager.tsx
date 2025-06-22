"use client"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { isBefore, isAfter, format, formatDistanceToNow} from "date-fns";
import React, { useEffect, useState } from "react"
import useFetch from "@/hooks/use-fetch";
import { updateSprintStatus } from "@/actions/sprint";
import { useOrganization } from "@clerk/nextjs";

interface SprintManagerProps {
  sprint: any;
  setSprint: (sprint: any) => void;
  sprints: any[];
  projectId: string;
}

const SprintManager: React.FC<SprintManagerProps> = ({ sprint, setSprint, sprints, projectId }) => {

    const [status, setStatus] = useState(sprint.status)
    const { membership } = useOrganization();

    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();

    const canStart = status === "PLANNED" && isBefore(now, endDate);
    const canEnd = status === "ACTIVE";
    const isAdmin = membership?.role === "org:admin";

    const {
        fetchData: updateStatus,
        isLoading,
        error,
        data: updateStatusData,
    } = useFetch(updateSprintStatus)

    const handleStatusChange = async(newStatus: string) => {
        if (!isAdmin) {
            console.error("Only organization admins can update sprint status");
            return;
        }

        try {
            await updateStatus(sprint.id, newStatus);
            // Update local state immediately for better UX
            setStatus(newStatus);
            setSprint({
                ...sprint,
                status: newStatus,
            });
        } catch (error) {
            console.error("Failed to update sprint status:", error);
        }
    }

    // Update local status when sprint prop changes (e.g., when switching between sprints)
    useEffect(() => {
        setStatus(sprint.status);
    }, [sprint.id, sprint.status]);

    // Handle successful API response
    useEffect(() => {
        if (updateStatusData && updateStatusData.success && !isLoading) {
            // Only update if the data is for the current sprint
            if (updateStatusData.sprint && updateStatusData.sprint.id === sprint.id) {
                const newStatus = updateStatusData.sprint.status;
                setStatus(newStatus);
                setSprint({
                    ...sprint,
                    status: newStatus,
                });
            }
        }
    }, [updateStatusData, isLoading]);

    const handleSprintChange = (value: string) => {
        const selectedSprint = sprints.find((s: any) => s.id === value);
        if (selectedSprint) {
            setSprint(selectedSprint);
            setStatus(selectedSprint.status);
        }
    }

    const getStatusText = () => {
        if(status === "COMPLETED"){
            return "Sprint Ended"
        }

        if(status === "ACTIVE" && isAfter(now,endDate)){
            return `Overdue by ${formatDistanceToNow(endDate)}`
        }

        if(status === "PLANNED" && isBefore(now,startDate)){
            return `Starts in ${formatDistanceToNow(startDate)}`      
        }

        if(status === "ACTIVE") {
            return "Sprint Active"
        }

        if(status === "PLANNED") {
            return "Sprint Planned"
        }

         return null;  
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                    <Select value={sprint.id} onValueChange={handleSprintChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Sprint" />
                        </SelectTrigger>
                        <SelectContent>
                            {sprints.map((sp: any) => (
                                <SelectItem key={sp.id} value={sp.id}>
                                    {sp.name} ({format(new Date(sp.startDate),"MMM d, yyyy")}) - ({format(new Date(sp.endDate),"MMM d, yyyy")})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    {isAdmin && canStart && (
                        <Button 
                            onClick={() => handleStatusChange("ACTIVE")}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isLoading ? "Starting..." : "Start Sprint"}
                        </Button>
                    )}

                    {isAdmin && canEnd && (
                        <Button 
                            onClick={() => handleStatusChange("COMPLETED")}
                            disabled={isLoading}
                            variant="destructive"
                        >
                            {isLoading ? "Ending..." : "End Sprint"}
                        </Button>
                    )}

                    {!isAdmin && (canStart || canEnd) && (
                        <div className="text-sm text-gray-400 italic">
                            Only admins can manage sprints
                        </div>
                    )}
                </div>
            </div>

            {getStatusText() && (
                <div className="flex items-center gap-2">
                    <Badge variant={status === "ACTIVE" ? "default" : status === "COMPLETED" ? "secondary" : "outline"}>
                        {getStatusText()}
                    </Badge>
                </div>
            )}
        </div>
    )
};

export default SprintManager