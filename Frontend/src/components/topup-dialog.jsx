import { CirclePlus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import z from "zod";
import { Input } from "./ui/input";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function DialogTopUp({ refreshData }) {
  const [open, setopen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    balance: z.number().min(100_000, "Minimum top up Rp 100.000"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balance: 0,
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/api/topup", form.getValues());
      setopen(false);
      refreshData();
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
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus /> Top Up
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top Up</DialogTitle>
          <DialogDescription>
            Top up your wallet to pay your installments
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="balance"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Balance</FieldLabel>
                <Input
                  {...field}
                  value={formatRupiah(field.value)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    field.onChange(raw ? parseInt(raw) : 0);
                  }}
                  placeholder="100.000"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter className="mt-5">
            <div className="flex items-center justify-end">
              <Button type="submit">{loading ? <Spinner /> : "Top Up"}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
