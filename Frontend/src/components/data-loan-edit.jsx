import {
  Download,
  FileIcon,
  FileText,
  Save,
  Trash2Icon,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Field, FieldError, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { AlertTitle } from "./ui/alert";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useRef, useState } from "react";
import { Spinner } from "./ui/spinner";

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

export function LoanReadEdit({ loans, fetchLoan, edit, setEdit }) {
  const tenor = [3, 6, 9, 12, 15, 18, 24];
  const [loading, setloading] = useState(false);

  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  const deleteDoc = async (id) => {
    setloading(true);
    try {
      await api.delete(`/document/${id}`);
      fetchLoan();
    } catch (erros) {
      toast.error(erros.response?.data?.message);
    } finally {
      setloading(false);
    }
  };

  const formSchema = z.object({
    name: z.string().trim().min(1, "The name field is required"),
    email: z.string().trim().min(1, "The email field is required"),
    purpose: z.string().trim().min(1, "The purpose field is required"),
    address: z.string().trim().min(1, "The address field is required"),
    tenor: z
      .number("The tenor field is required")
      .min(1, "The tenor field is required"),
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
      name: loans.name || "",
      email: loans.email || "",
      purpose: loans.purpose || "",
      address: loans.address || "",
      tenor: loans.tenor || "",
      business_name: loans.business_name || "",
      phone_number: loans.phone_number || "",
      account_number: loans.account_number || "",
      amount: loans.amount || "",
      ktp: [],
      npwp: [],
    },
  });

  const onSubmit = async (data) => {
    setloading(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("purpose", data.purpose);
      formData.append("address", data.address);
      formData.append("tenor", data.tenor);
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
      form();
    } catch (errors) {
      toast.error(errors.response?.data?.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Name</p>
            <Input
              className="text-[16px] font-medium"
              {...form.register("name")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Email</p>
            <Input
              className="text-[16px] font-medium"
              {...form.register("email")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Phone Number</p>
            <Input
              className="text-[16px] font-medium"
              {...form.register("phone_number")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Business Name</p>
            <Input
              className="text-[16px] font-medium"
              {...form.register("business_name")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Purpose</p>
            <Input
              className="text-[16px] font-medium"
              {...form.register("purpose")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Address</p>
            <Textarea
              className="text-[16px] font-medium"
              {...form.register("address")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Tenor</p>
            <Controller
              name="tenor"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
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
                          {t} Months
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
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Amount</p>
            <Input
              className="text-[16px] font-medium"
              value={formatRupiah(form.getValues("amount"))}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                form.setValue("amount", raw);
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm">Account Number</p>
            <Input
              className="text-[16px] font-medium"
              {...form.register("account_number")}
            />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Request Date</p>
            <h1 className="text-[16px] font-medium">{loans.request_date}</h1>
          </div>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="font-medium">KTP</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {loans.documents
                .filter((d) => d.type === "ktp")
                .map((d) => {
                  const fileName = d.path.split("/").pop();
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                  return (
                    <div key={d.id} className="mb-2">
                      <div className="border p-2 rounded-lg flex items-center gap-2">
                        {isImage ? (
                          <img
                            src={`http://localhost:8000/storage/${d.path}`}
                            alt={fileName}
                            className="w-10 h-10 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center">
                            <FileText />
                          </div>
                        )}
                        <h1 className="text-muted-foreground truncate">
                          {fileName}
                        </h1>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button size="icon" variant="destructive">
                              <X />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertTitle>Are you absolutely sure?</AlertTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => deleteDoc(d.id)}
                              >
                                {loading ? <Spinner /> : <Trash2Icon />}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="font-medium">NPWP</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {loans.documents
                .filter((d) => d.type === "npwp")
                .map((d) => {
                  const fileName = d.path.split("/").pop();
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                  return (
                    <div key={d.id} className="mb-2">
                      <div className="border p-2 rounded-lg flex items-center gap-2">
                        {isImage ? (
                          <img
                            src={`http://localhost:8000/storage/${d.path}`}
                            alt={fileName}
                            className="w-10 h-10 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center">
                            <FileText />
                          </div>
                        )}
                        <h1 className="text-muted-foreground truncate">
                          {fileName}
                        </h1>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button size="icon" variant="destructive">
                              <X />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertTitle>Are you absolutely sure?</AlertTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => deleteDoc(d.id)}
                              >
                                {loading ? <Spinner /> : <Trash2Icon />}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {edit && (
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setEdit(false)}>
                Cancel
              </Button>
              <Button>
                <Save /> Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
