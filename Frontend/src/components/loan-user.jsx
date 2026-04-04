import {
  Clock,
  MoreVertical,
  Pencil,
  PiggyBank,
  Trash2Icon,
} from "lucide-react";
import { Header } from "./header";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useAuth } from "@/lib/auth";
import { DialogTopUp } from "./topup-dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "./ui/button";
import { AlertDialogDeleteLoan } from "./alert-dialog-delete-loan";

export function LoanUser({ loans, fetchLoans }) {
  const { user } = useAuth();
  const [wallets, setwallets] = useState([]);

  useEffect(() => {
    const fecthWallets = async () => {
      try {
        const res = await api.get("/api/wallets");
        setwallets(res.data.data);
      } catch (errros) {
        toast.error(errros.response?.data?.message);
      }
    };
    fecthWallets();
  }, []);

  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  return (
    <div className="w-full min-h-screen">
      <div className="w-full py-20 space-y-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span>
              <h1 className="font-semibold text-2xl">Dashboard Loan</h1>
              <p className="text-muted-foreground">Welcome, {user.name}</p>
            </span>
            <DialogTopUp refreshData={fetchLoans} />
          </div>
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center gap-3">
                <span className="w-15 h-15 flex items-center justify-center bg-secondary text-primary rounded-lg">
                  <PiggyBank className="size-7" />
                </span>
                <div>
                  <p className="text-muted-foreground">Jumlah Pinjaman</p>
                  <h1 className="font-semibold text-xl">
                    Rp{" "}
                    {formatRupiah(loans.reduce((sum, l) => sum + l.amount, 0))}
                  </h1>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3">
                <span className="w-15 h-15 flex items-center justify-center bg-amber-100 text-amber-600 rounded-lg">
                  <Clock className="size-7" />
                </span>
                <div>
                  <p className="text-muted-foreground">Pending</p>
                  <h1 className="font-semibold text-xl">
                    {
                      loans.filter(
                        (l) =>
                          l.status === "pending" && l.status === "approved",
                      ).length
                    }
                  </h1>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3">
                <span className="w-15 h-15 flex items-center justify-center bg-green-100 text-green-600 rounded-lg">
                  <Clock className="size-7" />
                </span>
                <div>
                  <p className="text-muted-foreground">Active</p>
                  <h1 className="font-semibold text-xl">
                    {loans.filter((l) => l.status === "success").length}
                  </h1>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3">
                <span className="w-15 h-15 flex items-center justify-center bg-red-100 text-red-600 rounded-lg">
                  <Clock className="size-7" />
                </span>
                <div>
                  <p className="text-muted-foreground">Wallet</p>
                  <h1 className="font-semibold text-xl">
                    Rp {formatRupiah(wallets.map((w) => w.balance))}
                  </h1>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="font-semibold text-lg">Loan Status</h1>
          <div className="grid grid-cols-4">
            {loans.map((l) => (
              <Card key={l.id}>
                <CardHeader>
                  <CardTitle>{l.business_name}</CardTitle>
                  <CardDescription>{l.purpose}</CardDescription>
                  <CardAction>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full border ${l.status === "pending" ? "bg-amber-100 text-amber-500 border-amber-200" : l.status === "approved" ? "bg-amber-100 text-amber-500 border-amber-200" : l.status === "success" ? "bg-green-100 text-green-500 border-green-200" : "bg-red-100 text-red-500 border-red-200"}`}
                    >
                      {l.status === "pending"
                        ? "pending"
                        : l.status === "approved"
                          ? "pending"
                          : l.status === "success"
                            ? "success"
                            : "Reject"}
                    </span>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <span>
                      <p className="text-muted-foreground text-sm">Name</p>
                      <h1 className="font-semibold text-sm">{l.name}</h1>
                    </span>
                    <span>
                      <p className="text-muted-foreground text-sm">Email</p>
                      <h1 className="font-semibold text-sm">{l.email}</h1>
                    </span>
                    <span>
                      <p className="text-muted-foreground text-sm">Tenor</p>
                      <h1 className="font-semibold text-sm">{l.tenor}</h1>
                    </span>
                    <span>
                      <p className="text-muted-foreground text-sm">
                        Amount of funds
                      </p>
                      <h1 className="font-semibold text-sm">
                        Rp {formatRupiah(l.amount)}
                      </h1>
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  {l.status === "pending" && (
                    <CardAction className="space-x-2">
                      <AlertDialogDeleteLoan loans={l} />
                      <Button>
                        <Pencil /> Edit
                      </Button>
                    </CardAction>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="font-semibold text-lg">Installments</h1>
          <div className="grid grid-cols-4">
            {loans.filter((l) => l.status === "success").length ? (
              <>
                {loans
                  .filter((l) => l.status === "success")
                  .map((l) => {
                    const nextInstallments = l.installments.find(
                      (i) => i.status === "pending",
                    );

                    if (!nextInstallments) return null;

                    return <Card key={l.id}></Card>;
                  })}
              </>
            ) : (
              <div className="w-full border-dashed border-2 flex items-center justify-center rounded-xl py-20">
                <h1 className="text-muted-foreground">No Installments Found</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
