"use client"
import React, { useEffect, useState } from "react"
import SprintManager from "./sprintmanager"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import IssueCreationDrawer from "./createissue";
import useFetch from "@/hooks/use-fetch";
import { getIssuesForSprint } from "@/actions/issue";
import IssueCard from "@/components/issuecard";
import { toast } from "sonner";
import { updateIssueOrder } from "@/actions/issue";
import { getStatuses, createStatus, updateStatus, deleteStatus } from "@/actions/status";
import { useOrganization } from "@clerk/clerk-react";

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const[removed] = result.splice(startIndex,1);
  result.splice(endIndex,0,removed)

  return result;
}

interface SprintBoardProps {
  sprints: any[] // Replace 'any' with the actual sprint type if available
  projectId: string
  orgId: string
}

const SprintBoard: React.FC<SprintBoardProps> = ({ sprints, projectId, orgId }) => {
  const [currentSprint,setCurrentSprint] = useState(
    sprints.find((spr: any)=>spr.status === "ACTIVE") || sprints[0]
  ); 

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const [statuses, setStatuses] = useState<any[]>([]);

  const handleAddIssue = (statusId: string)=>{
    setSelectedStatus(statusId);
    setIsDrawerOpen(true);
  }

  const {
    isLoading: issuesLoading,
    error: issuesError,
    fetchData: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);

  useEffect(()=>{
    if (currentSprint.id) {
      fetchIssues(currentSprint.id);     
    }
  },[currentSprint.id, orgId])

  const [filteredIssues,setFliteredIssues] = useState(issues);

  const fetchStatuses = async () => {
    const data = await getStatuses(orgId);
    setStatuses(data);
  }

  const handleIssueCreated = () => {
    fetchIssues(currentSprint.id);
  }

  const {
    fetchData: updateIssueOrderFn,
    isLoading: updatedIssuesLoading,
    error: updatedIssuesError,
  } = useFetch(updateIssueOrder);
  
  const onDragEnd = async (result: any) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board ")      
      return;
    }

    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot Update Board after sprint end  ")      
      return;
    }
 
    const { destination, source } = result 

    if(!destination){
      return;
    }

    if(destination.droppableId === source.droppableId && destination.index === source.index){
      return;
    }
 
    const newOrderedData = issues ? [...issues] : [];

    const sourceList = newOrderedData.filter(
      (list) => list.statusId === source.droppableId
    );

    const destinationList = newOrderedData.filter(
      (list) => list.statusId === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(
        sourceList,
        source.index,
        destination.index
      );
      reorderedCards.forEach((card: any, i: number) => {
        card.order = i;
      });
    } else {
      const [movedCard] = sourceList.splice(source.index, 1);
      movedCard.statusId = destination.droppableId;
      destinationList.splice(destination.index, 0, movedCard);
      sourceList.forEach((card: any, i: number) => {
        card.order = i;
      });
      destinationList.forEach((card: any, i: number) => {
        card.order = i;
      });
    }
    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    setIssues(sortedIssues);
    // api call
    updateIssueOrderFn(sortedIssues);
  }
  
  useEffect(() => {
    fetchStatuses();
  }, [orgId]);

  const handleAddColumn = async () => {
    // TODO: Show a modal or prompt for name/key
    const key = "NEW_COLUMN_" + Date.now();
    await createStatus(orgId, { name: "New Column", key });
    fetchStatuses();
  };

  const handleEditColumn = async (column: any) => {
    // TODO: Show a modal or prompt for new name/key
    const newName = prompt("Enter new column name", column.name);
    if (newName) {
      await updateStatus(orgId, column.id, { name: newName });
      fetchStatuses();
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    await deleteStatus(orgId, columnId);
    fetchStatuses();
  };

    return (
    <div>
    {/* sprintManager */}
    <SprintManager
    sprint={currentSprint}
    setSprint={setCurrentSprint}
    sprints={sprints}
    projectId={projectId}    
    />



    {/* KanBan Board */}
    <DragDropContext onDragEnd={onDragEnd}>

      <div className="flex gap-4 mt-4 bg-slate-900 p-4 rounded-lg overflow-x-auto">
        {statuses.map((column)=>(
          <div key={column.id} className="min-w-[280px]">
            <Droppable droppableId={column.id}>
                {(provided)=>{
                  return (
                    <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 p-2 rounded-lg bg-slate-800"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold mb-2">{column.name}</h3>
                        {isAdmin && (
                          <div className="flex gap-1">
                            <button onClick={() => handleEditColumn(column)}>✏️</button>
                            <button onClick={() => handleDeleteColumn(column.id)}>🗑️</button>
                          </div>
                        )}
                      </div>

                      {/* Issues */}

                    {issues?.filter((issue)=> issue.statusId === column.id)
                      .map((issue,index)=>(
                        <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        >
                          {(provided)=>{
                            return(
                              <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}>
                                
                                <IssueCard 
                                  issue={issue}
                                  onDelete={() => fetchIssues(currentSprint.id)}
                                  onUpdate={() => fetchIssues(currentSprint.id)}
                                />
                              
                              </div>
                            )
                          }}

                        </Draggable>
                      ))} 

                      {provided.placeholder}
                      <Button variant="ghost" className="w-full" onClick={()=>handleAddIssue(column.id)}>
                          <Plus className="mr-2 h-4 w-4"/>
                          Create Issue
                      </Button>
                    </div>
                  ); 
                }}
            </Droppable>
          </div>
        ))}
        {isAdmin && (
          <div className="min-w-[280px]">
            <Button className="w-full" onClick={() => handleAddColumn()}>
              <Plus className="mr-2 h-4 w-4"/>
              Add Column
            </Button>
          </div>
        )}
      </div>

    </DragDropContext>

    {isDrawerOpen && selectedStatus && <IssueCreationDrawer
      isOpen={isDrawerOpen}
      onclose={() => setIsDrawerOpen(false)}
      sprintId={currentSprint.id}
      status={selectedStatus} // This is now statusId
      projectId={projectId}
      onIssueCreated={handleIssueCreated}
      orgId={orgId}
>

    </IssueCreationDrawer>}

    </div>
  )
}

export default SprintBoard