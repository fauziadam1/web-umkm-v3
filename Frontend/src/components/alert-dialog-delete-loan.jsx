import { Trash2Icon, TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export function AlertDialogDeleteLoan({ loans }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/loan/${id}`);
      toast.success("Loan Canceled");
      navigate("/dashboard/user");
    } catch (errors) {
      toast.error(errors.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive">
          <Trash2Icon /> Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => onDelete(loans.id)}
          >
            {loading ? <Spinner /> : <TriangleAlert />}
            Delete Loan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
