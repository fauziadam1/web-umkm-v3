import { Download, FileText } from "lucide-react";
import { Button } from "./ui/button";

export function LoanReadOnly({ loans }) {
  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        <div>
          <p className="text-muted-foreground text-sm">Name</p>
          <h1 className="text-[16px] font-medium">{loans?.name}</h1>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Email</p>
          <h1 className="text-[16px] font-medium">{loans?.email}</h1>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Phone Number</p>
          <h1 className="text-[16px] font-medium">{loans?.phone_number}</h1>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Business Name</p>
          <h1 className="text-[16px] font-medium">{loans?.business_name}</h1>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Purpose</p>
          <h1 className="text-[16px] font-medium">{loans?.purpose}</h1>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Address</p>
          <h1 className="text-[16px] font-medium">{loans?.address}</h1>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Tenor</p>
          <h1 className="text-[16px] font-medium">{loans?.tenor} Months</h1>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Amount</p>
          <h1 className="text-[16px] font-medium">
            Rp {formatRupiah(loans?.amount)}
          </h1>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Account Number</p>
          <h1 className="text-[16px] font-medium">{loans?.account_number}</h1>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Request Date</p>
          <h1 className="text-[16px] font-medium">{loans?.request_date}</h1>
        </div>
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <h1 className="font-medium">KTP</h1>
          <div className="grid grid-cols-2 gap-4">
            {loans?.documents
              ?.filter((d) => d.type === "ktp")
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
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border rounded-md">
                          <FileText />
                        </div>
                      )}

                      <h1 className="text-muted-foreground truncate">
                        {fileName}
                      </h1>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          window.open(
                            `http://localhost:8000/api/document/download/${d.id}`,
                            "_blank",
                          )
                        }
                      >
                        <Download />
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="font-medium">NPWP</h1>
          <div className="grid grid-cols-2 gap-4">
            {loans?.documents
              ?.filter((d) => d.type === "npwp")
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
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          window.open(
                            `http://localhost:8000/api/document/download/${d.id}`,
                            "_blank",
                          )
                        }
                      >
                        <Download />
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
