import z from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useState } from "react";
import { HandCoins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema } from "@/lib/schema/password";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const formSchema = z
    .object({
      name: z.string().trim().min(1, "The name field is required"),
      email: z.string().trim().min(1, "The email field is required"),
      password: PasswordSchema,
      password_confirmation: z
        .string()
        .trim()
        .min(1, "The confirm field is required"),
    })
    .refine((value) => value.password_confirmation === value.password, {
      message: "The confirm does not match",
      path: ["password_confirmation"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/register", form.getValues());
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
            <h1 className="font-semibold text-lg">Create account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to create account
            </p>
          </span>
        </div>
        <div className="min-w-md space-y-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...field} placeholder="Name" autoComplete="off" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
                  <Input
                    type="password"
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
            <Controller
              name="password_confirmation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Confirm</FieldLabel>
                  <Input
                    type="password"
                    {...field}
                    placeholder="Confirm"
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
                {loading ? <Spinner /> : "Create"}
              </Button>
            </Field>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="underline decoration-gray-400 underline-offset-3 font-medium duration-200 hover:underline hover:decoration-foreground text-foreground"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
