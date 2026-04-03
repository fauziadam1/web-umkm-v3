import z from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useState } from "react";
import { HandCoins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth";
import { PasswordInput } from "@/components/ui/password-input";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().trim().min(1, "The email field is required"),
    password: z.string().trim().min(1, "The password field is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/login", form.getValues());
      login(res.data.token);
      navigate("/dashboard/user");
    } catch (errors) {
      toast.error(errors.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-2">
          <Link to={"/"}>
            <span className="w-10 h-10 bg-primary flex items-center justify-center text-white rounded-lg">
              <HandCoins />
            </span>
          </Link>
          <span className="text-center">
            <h1 className="font-semibold text-lg">Log In to your account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and passowrd to log in
            </p>
          </span>
        </div>
        <div className="min-w-md space-y-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    {...field}
                    placeholder="example@email.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    placeholder="Password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner /> : "Login"}
              </Button>
            </Field>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to={"/register"}
              className="underline decoration-gray-400 underline-offset-3 font-medium duration-200 hover:underline hover:decoration-foreground text-foreground"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
