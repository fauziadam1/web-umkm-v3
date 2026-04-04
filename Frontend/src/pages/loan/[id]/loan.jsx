import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, CircleCheck, CircleX, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function LoanDetailPage() {
  const { user } = useAuth();
  const [loans, setloans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLoans = async () => {
    try {
      const res = await api.get("/api/loans");
      setloans(res.data.data);
    } catch (errors) {
      toast.error(errors.reponse?.data?.message);
    }
  };

  useEffect(() => {
    (() => fetchLoans())();
  }, []);

  const approved = async (id) => {
    setLoading(true);
    try {
      await api.put(`/api/loan/${id}`, {
        status: "approved",
      });
      fetchLoans();
    } catch (errors) {
      toast.error(errors.reponse?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const success = async (id) => {
    try {
      await api.put(`/api/loan/${id}`, {
        status: "success",
      });
      fetchLoans();
    } catch (errors) {
      toast.error(errors.reponse?.data?.message);
    }
  };

  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  const roleRedirect = {
    user: "/dashboard/user",
    admin: "/dashboard/admin",
    manager: "/dashboard/user",
  };

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="w-full py-20 px-5 flex items-center justify-center">
        {loans.map((l) => (
          <div key={l.id} className="sm:max-w-2xl lg:max-w-4xl space-y-5">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <span>
                  <h1 className="text-2xl font-medium">Loan Detail</h1>
                  <p className="text-muted-foreground text-sm">
                    {l.name} ({l.business_name})
                  </p>
                </span>
                <Link to={roleRedirect[user?.role]}>
                  <Button variant="secondary">
                    <ArrowLeft />
                    Back
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                <div>
                  <p className="text-muted-foreground text-sm">Name</p>
                  <h1 className="text-[16px] font-medium">{l.name}</h1>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <h1 className="text-[16px] font-medium">{l.email}</h1>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Phone Number</p>
                  <h1 className="text-[16px] font-medium">{l.phone_number}</h1>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Business Name</p>
                  <h1 className="text-[16px] font-medium">{l.business_name}</h1>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Purpose</p>
                  <h1 className="text-[16px] font-medium">{l.purpose}</h1>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Address</p>
                  <h1 className="text-[16px] font-medium">{l.address}</h1>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Tenor</p>
                  <h1 className="text-[16px] font-medium">{l.tenor} Months</h1>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Amount</p>
                  <h1 className="text-[16px] font-medium">
                    Rp {formatRupiah(l.amount)}
                  </h1>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Account Number
                  </p>
                  <h1 className="text-[16px] font-medium">
                    {l.account_number}
                  </h1>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Request Date</p>
                  <h1 className="text-[16px] font-medium">{l.request_date}</h1>
                </div>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <h1 className="font-medium">KTP</h1>
                  <div className="grid grid-cols-2 gap-4">
                    {l.documents
                      .filter((d) => d.type === "ktp")
                      .map((d) => {
                        const fileName = d.path.split("/").pop();

                        return (
                          <div key={d.id}>
                            <div className="border p-2 rounded-lg flex items-center gap-2">
                              <img
                                src={`http://localhost:8000/storage/${d.path}`}
                                alt="ktp"
                                className="w-8 h-8 rounded-md border"
                              />
                              <h1 className="text-muted-foreground truncate">
                                {fileName}
                              </h1>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  window.open(
                                    `http://localhost:8000/api/document/download/${d.id}`,
                                    "_blank",
                                  )
                                }
                              >
                                <Download />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="font-medium">NPWP</h1>
                  <div className="grid grid-cols-2 gap-4">
                    {l.documents
                      .filter((d) => d.type === "npwp")
                      .map((d) => {
                        const fileName = d.path.split("/").pop();

                        return (
                          <div key={d.id}>
                            <div className="border p-2 rounded-lg flex items-center gap-2">
                              <img
                                src={`http://localhost:8000/storage/${d.path}`}
                                alt="ktp"
                                className="w-8 h-8 rounded-md border"
                              />
                              <h1 className="text-muted-foreground truncate">
                                {fileName}
                              </h1>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  window.open(
                                    `http://localhost:8000/api/document/download/${d.id}`,
                                    "_blank",
                                  )
                                }
                              >
                                <Download />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div>
                  {user?.role === "admin" && (
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="destructive">
                        <CircleX /> Reject
                      </Button>
                      <Button onClick={() => approved(l.id)}>
                        <CircleCheck /> Approve
                      </Button>
                    </div>
                  )}
                  {user?.role === "manager" && (
                    <div>
                      {l.status === "approved" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button onClick={() => approved(l.id)}>
                            <CircleCheck /> Activate
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button disabled>Waiting Admin</Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
