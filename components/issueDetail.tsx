import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import useFetch from "@/hooks/use-fetch";
import { useUser, useOrganization } from "@clerk/clerk-react";
import { useState } from "react";
import statuses from "@/data/status.json";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./user-avatar";
import { deleteIssue, updateIssue } from "@/actions/issue";
import { Button } from "@/components/ui/button";

interface IssueDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  issue: any;
  onDelete?: () => void;
  onUpdate?: () => void;
}

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const IssueDetailsDialog: React.FC<IssueDetailsDialogProps> = ({
  isOpen,
  onClose,
  issue,
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);

  const { user } = useUser();
  const { membership } = useOrganization();

  const {
    isLoading: deleteLoading,
    error: deleteError,
    fetchData: deleteIssueFn,
    data: deleted,
  } = useFetch(deleteIssue);

  const {
    isLoading: updateLoading,
    error: updateError,
    fetchData: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    await updateIssueFn(issue.id, { status: newStatus, priority });
    onUpdate();
  };

  const handlePriorityChange = async (newPriority: string) => {
    setPriority(newPriority);
    await updateIssueFn(issue.id, { status, priority: newPriority });
    onUpdate();
  };

  const handleDelete = async () => {
    await deleteIssueFn(issue.id);
    onDelete();
    onClose();
  };

  const canChange =
    user?.id === issue.reporter?.clerkUserId || membership?.role === "org:admin";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
          

            <Select value={priority} onValueChange={handlePriorityChange} disabled={!canChange}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <h4 className="font-semibold">Description</h4>
          <MDEditor.Markdown className="rounded px-2 py-3" source={issue.description ? issue.description : " "} />
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Assignee</h4>
            <UserAvatar user={issue.assignee} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Reporter</h4>
            <UserAvatar user={issue.reporter} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailsDialog;