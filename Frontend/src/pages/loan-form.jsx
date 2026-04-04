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
import { useRef, useState } from "react";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, FileText, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router";

function FileUpload({ value = [], onChange }) {
  const inputRef = useRef(null);

  function handleAddFile(fileList) {
    const newFiles = [...value, ...Array.from(fileList)];
    onChange(newFiles);
  }

  function handleRemove(index) {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current.click()}
      >
        <FileIcon className="size-4" /> Choose File
      </Button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          handleAddFile(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="flex gap-3 mt-3 flex-wrap">
        {value.map((file, index) => {
          const isImage = file.type.startsWith("image/");

          return (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50"
            >
              {isImage ? (
                <div className="flex items-center justify-center gap-2 text-sm p-2">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <span className="truncate">{file.name}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm p-2">
                  <FileText className="size-5" />
                  <span className="truncate">{file.name}</span>
                </div>
              )}

              <Button
                size="icon"
                type="button"
                variant="destructive"
                onClick={() => handleRemove(index)}
                className="rounded-full size-7 mr-2"
              >
                ×
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LoanForm() {
  const tenor = [3, 6, 9, 12, 15, 18, 24];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const formSchema = z.object({
    name: z.string().trim().min(1, "The name field is required"),
    email: z.string().trim().min(1, "The email field is required"),
    purpose: z.string().trim().min(1, "The purpose field is required"),
    address: z.string().trim().min(1, "The address field is required"),
    tenor: z
      .number("The tenor field is required")
      .min(1, "The tenor field is required"),
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
      .number("The account number is required")
      .min(1, "The account number field is required"),
    amount: z
      .number("The amount of funds field is required")
      .min(1, "The amount of funds field is required"),
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
      email: "",
      purpose: "",
      address: "",
      tenor: "",
      request_date: today,
      business_name: "",
      phone_number: "",
      account_number: "",
      amount: "",
      ktp: [],
      npwp: [],
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("purpose", data.purpose);
      formData.append("address", data.address);
      formData.append("tenor", data.tenor);
      formData.append("request_date", data.request_date);
      formData.append("business_name", data.business_name);
      formData.append("phone_number", data.phone_number);
      formData.append("account_number", data.account_number);
      formData.append("amount", data.amount);

      (data.ktp || []).forEach((file) => {
        formData.append("ktp[]", file);
      });

      (data.npwp || []).forEach((file) => {
        formData.append("npwp[]", file);
      });

      await api.post("/api/loan", formData);
      navigate("/dashboard/user");
      toast.info(
        "Your loan application successful.",
        { description: "Please wait for further information." },
        { position: "top-center" },
      );
      form();
    } catch (errors) {
      toast.error(errors.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

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
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Name"
                        autoComplete="off"
                      />
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
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
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
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="business_name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Business Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Business Name"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="purpose"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Purpose</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Purpose"
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
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Address</FieldLabel>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Address"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="amount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Amount of funds</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        value={formatRupiah(field.value)}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          field.onChange(raw ? parseInt(raw) : 0);
                        }}
                        placeholder="100.000.000"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="tenor"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Tenor</FieldLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select Tenor" />
                        </SelectTrigger>
                        <SelectContent className="-translate-x-0.5">
                          {tenor.map((t) => (
                            <SelectItem key={t} value={t.toString()}>
                              {t} bulan
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="phone_number"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Phone Number</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Phone Number"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="account_number"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Account Number</FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        aria-invalid={fieldState.invalid}
                        placeholder="Account Number"
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
                name="request_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Request Date</FieldLabel>
                    <Input {...field} type="date" autoComplete="off" readOnly />
                  </Field>
                )}
              />
              <Controller
                name="ktp"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>KTP</FieldLabel>
                    <FileUpload value={field.value} onChange={field.onChange} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="npwp"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>NPWP</FieldLabel>
                    <FileUpload value={field.value} onChange={field.onChange} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button disabled={loading}>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send /> Send
                    </span>
                  )}
                </Button>
              </Field>
            </form>
          </FieldGroup>
        </FieldGroup>
      </div>
    </div>
  );
}
