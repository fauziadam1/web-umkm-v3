import { LoanReadEdit } from "@/components/data-loan-edit";
import { LoanReadOnly } from "@/components/data-loan-readonly";
import { Header } from "@/components/header";
import { TableInstallments } from "@/components/table-installments";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeft,
  CircleCheck,
  CircleX,
  Download,
  FileText,
  Pencil,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

export default function LoanDetailPage() {
  const { user, loading } = useAuth();
  const [loans, setloans] = useState(null);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingLoan, setLoadingLoan] = useState(false);
  const [edit, setEdit] = useState(false);
  const { id } = useParams();

  const fetchLoans = async () => {
    setLoadingPage(true);
    try {
      const res = await api.get(`/api/loan/${id}`);
      setloans(res.data.data);
    } catch (errors) {
      toast.error(errors.reponse?.data?.message);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    (() => fetchLoans())();
  }, []);

  const approved = async (id) => {
    setLoadingLoan(true);
    try {
      await api.put(`/api/approve/loan/${id}`, {
        status: "approved",
      });
      fetchLoans();
    } catch (errors) {
      toast.error(errors.reponse?.data?.message);
    } finally {
      setLoadingLoan(false);
    }
  };

  const success = async (id) => {
    setLoadingLoan(true);
    try {
      await api.put(`/api/success/loan/${id}`, {
        status: "success",
      });
      fetchLoans();
    } catch (errors) {
      toast.error(errors.reponse?.data?.message);
    } finally {
      setLoadingLoan(false);
    }
  };

  const roleRedirect = {
    user: "/dashboard/user",
    admin: "/dashboard/admin",
    manager: "/dashboard/user",
  };

  if (loadingPage) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="w-full py-20 px-5 flex items-center justify-center">
        <div className="w-full sm:max-w-2xl lg:max-w-4xl space-y-5">
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <span>
                <h1 className="text-2xl font-medium">Loan Detail</h1>
                <p className="text-muted-foreground text-sm">
                  {loans?.name} ({loans?.business_name})
                </p>
              </span>
              <Link to={roleRedirect[user?.role]}>
                <Button variant="secondary">
                  <ArrowLeft />
                  Back
                </Button>
              </Link>
            </div>
            {edit ? (
              <LoanReadEdit loans={loans} edit={edit} setEdit={setEdit} />
            ) : (
              <LoanReadOnly loans={loans} />
            )}
            {user?.role === "user" && loans?.status === "pending" && (
              <div className="flex items-center justify-end gap-2">
                {!edit && (
                  <Button onClick={() => setEdit(true)}>
                    <Pencil /> Edit
                  </Button>
                )}
              </div>
            )}
            <TableInstallments loans={loans} />
          </div>
          <div>
            {user?.role === "admin" && (
              <div className="flex items-center justify-end gap-2">
                {loans?.status === "pending" ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="destructive">
                      <CircleX /> Reject
                    </Button>
                    <Button onClick={() => approved(loans?.id)}>
                      {loadingLoan ? <Spinner /> : <CircleCheck />}
                      Approve
                    </Button>
                  </div>
                ) : loans?.status === "approved" ? (
                  <Button disabled>Approved</Button>
                ) : loans?.status === "success" ? (
                  <Button disabled>Loan Active</Button>
                ) : (
                  <Button variant="destructive" disabled>
                    Loan Reject
                  </Button>
                )}
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              {user?.role === "manager" &&
                (loans?.status === "approved" ? (
                  <Button onClick={() => success(loans?.id)}>
                    {loadingLoan ? <Spinner /> : <CircleCheck />}
                    Activate
                  </Button>
                ) : loans?.status === "pending" ? (
                  <Button disabled>Waiting Admin</Button>
                ) : loans?.status === "success" ? (
                  <Button className="bg-green-500 text-white" disabled>
                    Loan Actived
                  </Button>
                ) : (
                  <Button variant="destructive" disabled>
                    Loan Reject
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
