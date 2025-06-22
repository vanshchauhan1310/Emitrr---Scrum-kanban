import { issue } from "@uiw/react-md-editor";
import React, { useState } from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import UserAvatar from './user-avatar';
import { formatDistanceToNow } from "date-fns";
import IssueDetailsDialog from './issueDetail';

const priorityColor = {
    LOW: "border-green-600",
    MEDIUM: "border-yellow-300",
    HIGH: "border-orange-400",
    URGENT: "border-red-400",
}

interface IssueCardProps {
  issue: any;
  showStatus?: boolean;
  onDelete?: () => void;
  onUpdate?: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({
    issue,
    showStatus = false,
    onDelete = () => {},
    onUpdate = () => {},
    })=>{

        const [isDialogOpen, setIsDialogOpen] = useState(false);

        const onDeleteHandler = () => {
          onDelete();
        };

        const onUpdateHandler = () => {
          onUpdate();
        };

        const created = formatDistanceToNow(new Date(issue.createdAt),{
            addSuffix: true,
        })
        return <>
        <div onClick={() => setIsDialogOpen(true)}>
          <Card className={`cursor-pointer hover:shadow-md transition-shadow border-t-2 ${priorityColor[issue.priority as keyof typeof priorityColor]}`}>
            <CardHeader className="rounded-lg">
              <CardTitle>{issue.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 -mt-3">
              {showStatus && <Badge>{issue.status}</Badge>}
              <Badge variant = "outline" className="-ml-1">
                  {issue.priority}
              </Badge>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-3">
              <UserAvatar user = {issue.assignee}/>
              <div className="text-xs text-gray-400 w-full">Created {created}</div>
            </CardFooter>
          </Card>
        </div>
        {isDialogOpen && (
          <IssueDetailsDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            issue={issue}
            onDelete={onDeleteHandler}
            onUpdate={onUpdateHandler}
          />
        )}
      </>

  };

export default IssueCard;