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
import {
  ArrowLeft,
  CircleCheck,
  CircleX,
  Download,
  FileText,
} from "lucide-react";
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
          <div key={l.id} className="w-full sm:max-w-2xl lg:max-w-4xl space-y-5">
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
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                          fileName,
                        );

                        return (
                          <div key={d.id} className="mb-2">
                            <div className="border p-2 rounded-lg flex items-center gap-2">
                              {isImage ? (
                                <img
                                  src={`http://localhost:8000/storage/${d.path}`}
                                  alt={fileName}
                                  className="w-10 h-10 rounded-md border object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border rounded-md">
                                  <FileText />
                                </div>
                              )}

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
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                          fileName,
                        );

                        return (
                          <div key={d.id} className="mb-2">
                            <div className="border p-2 rounded-lg flex items-center gap-2">
                              {isImage ? (
                                <img
                                  src={`http://localhost:8000/storage/${d.path}`}
                                  alt={fileName}
                                  className="w-10 h-10 rounded-md border object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center">
                                  <FileText />
                                </div>
                              )}
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
              </div>
              <div className="space-y-2">
                <h1 className="font-medium">Installments</h1>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full min-w-175">
                    <thead className="bg-gray-400">
                      <tr>
                        <th className="p-3 text-left font-semibold">
                          Interest
                        </th>
                        <th className="p-3 text-left font-semibold">
                          Principal
                        </th>
                        <th className="p-3 text-left font-semibold">Amount</th>
                        <th className="p-3 text-left font-semibold">
                          Remaining
                        </th>
                        <th className="p-3 text-left font-semibold">
                          Due Date
                        </th>
                        <th className="p-3 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {l.installments.map((i) => (
                        <tr key={i.id}>
                          <td className="p-3 text-left border-t text-sm">
                            <span>Rp {formatRupiah(i.interest)}</span>
                          </td>
                          <td className="p-3 text-left border-t text-sm">
                            <span>Rp {formatRupiah(i.principal)}</span>
                          </td>
                          <td className="p-3 text-left border-t text-sm">
                            <span>Rp {formatRupiah(i.amount)}</span>
                          </td>
                          <td className="p-3 text-left border-t text-sm">
                            <span>Rp {formatRupiah(i.remaining_balance)}</span>
                          </td>
                          <td className="p-3 text-left border-t text-sm">
                            <span>{i.due_date}</span>
                          </td>
                          <td className="p-3 text-left border-t text-sm">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full border ${i.status === "pending" ? "bg-amber-100 text-amber-500 border-amber-200" : i.status === "approved" ? "bg-blue-100 text-blue-500 border-blue-200" : i.status === "success" ? "bg-green-100 text-green-500 border-green-200" : "bg-red-100 text-red-500 border-red-200"}`}
                            >
                              {i.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
        ))}
      </div>
    </div>
  );
}
