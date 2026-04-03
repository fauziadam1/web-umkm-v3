import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ArrowRight, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function DashboardUser() {
  const { user, loading } = useAuth();
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const res = await api.get("/api/user/loans");
        setLoans(res.data.data);
      } catch (errors) {
        toast.error(errors.response?.data?.message);
      }
    };

    fetchLoan(loans);
  }, [loans]);

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
      <div className="w-full min-h-screen flex items-center justify-center px-5">
        {loans.filter((l) => l.user_id === user.id).length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-semibold text-lg sm:text-2xl">
              Selamat Datang, {user.name}
            </h1>
            <Card className="min-w-10 md:min-w-lg xl:min-w-xl py-10">
              <CardContent className="flex flex-col items-center gap-4">
                <CircleAlert className="size-20 text-primary" />
                <span className="text-center">
                  <h1 className="font-semibold text-lg">
                    Anda belum memiliki pinjaman
                  </h1>
                  <p className="text-muted-foreground text-xs max-w-sm">
                    DanaKu platform peminjaman online untuk UMKM yang terjamin
                    dan sudah diawasi oleh OJK
                  </p>
                </span>
                <Link to={"/loan/form"}>
                  <Button size="sm">
                    Ajukan Peminjaman <ArrowRight />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
