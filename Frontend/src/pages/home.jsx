import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ArrowRight, HomeIcon } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
  const { user } = useAuth();

  const roleRedirect = {
    user: "/dashboard/user",
    admin: "/dashboard/admin",
    manager: "/dashboard/manager",
  };

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Badge variant="secondary">Terdaftar & diawasi OJK</Badge>
          <h1 className="font-bold text-5xl max-w-2xl text-center">
            Wujudkan Pertumbuhan <span className="text-primary">UMKM</span> Anda
            Bersama DanaKu
          </h1>
          <p className="text-muted-foreground max-w-xl text-center">
            Platform peminjaman dana digital yang cepat, mudah, dan terpercaya.
            Dapatkan pinjaman hingga Rp 100 juta untuk mengembangkan usaha anda.
          </p>
          <div className="flex items-center gap-2">
            {user && (
              <Link to={roleRedirect[user.role]}>
                <Button>
                  <HomeIcon /> Dashboard
                </Button>
              </Link>
            )}
            {user?.role === "user" && (
              <Link to={"/loan/form"}>
                <Button variant={user ? "outline" : ""}>
                  Ajukan Pinjaman <ArrowRight />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
