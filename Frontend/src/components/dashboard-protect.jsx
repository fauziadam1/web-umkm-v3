import { useAuth } from "@/lib/auth";
import { Navigate, useLocation } from "react-router";
import { Spinner } from "./ui/spinner";

export function DashboardProtect({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const roleRedirect = {
    user: "/dashboard/user",
    admin: "/dashboard/admin",
    manager: "/dashboard/manager",
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  const correctPath = roleRedirect[user.role];

  if (location.pathname !== correctPath) {
    return <Navigate to={correctPath} replace />;
  }

  return children;
}
