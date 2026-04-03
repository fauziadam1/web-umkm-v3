import { useAuth } from "@/lib/auth";
import { HandCoins } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { AvatarUser } from "./header-user";

export function Header() {
  const { user } = useAuth();

  return (
    <div className="w-full bg-white flex items-center justify-between py-3 px-5 border-b fixed">
      <Link to={"/"} className="inline-flex items-center gap-2">
        <span className="w-8 h-8 bg-primary flex items-center justify-center text-white rounded-sm">
          <HandCoins className="size-4.5" />
        </span>
        <h1 className="font-semibold">DanaKu</h1>
      </Link>
      {user ? (
        <AvatarUser />
      ) : (
        <div className="inline-flex items-center gap-2">
          <Link to={"/register"}>
            <Button variant="outline">Register</Button>
          </Link>
          <Link to={"/login"}>
            <Button>Login</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
