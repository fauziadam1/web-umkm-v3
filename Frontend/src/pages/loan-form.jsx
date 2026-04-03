import z from "zod";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useState } from "react";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

export default function LoanForm() {
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().trim().min(1, "The name field is required"),
    email: z.string().trim().min(1, "The email field is required"),
    purpose: z.string().trim().min(1, "The purpose field is required"),
    address: z.string().trim().min(1, "The address field is required"),
    tenor: z.number().trim().min(1, "The tenor field is required"),
    request_date: z.string(),
    business_name: z
      .string()
      .trim()
      .min(1, "The business name field is required"),
    phone_number: z
      .string()
      .trim()
      .min(1, "The phone number field is required"),
    account_number: z
      .number()
      .trim()
      .min(1, "The account number field is required"),
    amount: z.number().trim().min(1, "The amount of funds field is required"),
    ktp: z
      .array(z.instanceof(File))
      .min(1, "At least upload 1 file")
      .max(3, "Max 3 Files"),
    npwp: z
      .array(z.instanceof(File))
      .min(1, "At least upload 1 file")
      .max(3, "Max 3 Files"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      await api.post("/api/loan");
    } catch (errors) {
      toast.error(errors.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="w-full flex items-center justify-center py-20">
        <FieldGroup className="max-w-2xl">
          <FieldSet>
            <FieldLegend>Form Pengajuan Peminjaman</FieldLegend>
            <FieldDescription>
              Enter your company detail to submit a loan
            </FieldDescription>
          </FieldSet>
          <FieldGroup>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                        {...field}
                        type="email"
                        placeholder="example@email.com"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Label Name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Label Name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button disabled={loading}>
                <Send /> Send
              </Button>
            </form>
          </FieldGroup>
        </FieldGroup>
      </div>
    </div>
  );
}
