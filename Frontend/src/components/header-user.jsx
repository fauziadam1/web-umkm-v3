import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import { LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";

export function AvatarUser() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      logout();
      navigate("/");
    } catch (errors) {
      toast.error(errors.response?.data?.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback>
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="-translate-x-5">
        <DropdownMenuItem asChild>
          <Link to={"/"}>
            <UserRound /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => Logout()}>
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
