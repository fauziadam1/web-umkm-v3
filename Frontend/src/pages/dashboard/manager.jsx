import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { api } from "@/lib/api";
import { CircleCheck, Clock, Eye, TrendingUp, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardManager() {
  const [loans, setloans] = useState([]);
  const [search, setsearch] = useState("");
  const [loading, setloading] = useState(false);
  const [currentPage, setcurrentPage] = useState(1);
  const [filterStatus, setfilterStatus] = useState("all");

  useEffect(() => {
    const fetchLoans = async () => {
      setloading(true);
      try {
        const res = await api.get("/api/loans");
        setloans(res.data.data);
      } catch (errors) {
        toast.error(errors.reponse?.data?.message);
      } finally {
        setloading(false);
      }
    };
    fetchLoans();
  }, []);

  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  const ITEMS_PER_PAGE = 5;

  const handleFilterChange = (value) => {
    setfilterStatus(value);
  };

  const filterData = loans.filter((l) => {
    const matchStatus = filterStatus === "all" || l.status === filterStatus;

    const matchSearch =
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.business_name?.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  const totalPages = Math.ceil(filterData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filterData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="w-full px-5 py-20">
        <div className="space-y-10">
          <div className="flex flex-col gap-3">
            <span>
              <h1 className="font-semibold text-2xl">Manage Loans</h1>
              <p className="text-muted-foreground">Dashboard Manager</p>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex items-center gap-3">
                  <span className="w-15 h-15 flex items-center justify-center bg-amber-100 text-amber-600 rounded-lg">
                    <Clock className="size-7" />
                  </span>
                  <div>
                    <p className="text-muted-foreground">Pending</p>
                    <h1 className="font-semibold text-xl">
                      {loans.filter((l) => l.status === "pending").length}
                    </h1>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3">
                  <span className="w-15 h-15 flex items-center justify-center bg-secondary text-primary rounded-lg">
                    <CircleCheck className="size-7" />
                  </span>
                  <div>
                    <p className="text-muted-foreground">Approved</p>
                    <h1 className="font-semibold text-xl">
                      {loans.filter((l) => l.status === "approved").length}
                    </h1>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3">
                  <span className="w-15 h-15 flex items-center justify-center bg-green-100 text-green-600 rounded-lg">
                    <TrendingUp className="size-7" />
                  </span>
                  <div>
                    <p className="text-muted-foreground">Active</p>
                    <h1 className="font-semibold text-xl">
                      {loans.filter((l) => l.status === "success").length}
                    </h1>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3">
                  <span className="w-15 h-15 flex items-center justify-center bg-red-100 text-red-600 rounded-lg">
                    <UsersRound className="size-7" />
                  </span>
                  <div>
                    <p className="text-muted-foreground">Total Loan</p>
                    <h1 className="font-semibold text-xl">{loans.length}</h1>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="space-y-3">
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row items-center md:justify-between gap-2">
                <h1 className="font-semibold text-lg w-full">Table Loan</h1>
                <div className="flex items-center justify-end gap-3 w-full">
                  <Input
                    value={search}
                    placeholder="Search: Business name, borrowers name"
                    className="w-full md:w-md xl:w-2xl"
                    onChange={(e) => setsearch(e.target.value)}
                  />
                  <Select defaultValue="all" onValueChange={handleFilterChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="success">Active</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="border overflow-x-auto rounded-lg">
                <table className="w-full min-w-300 table-fixed">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-3 text-left font-semibold">Business</th>
                      <th className="p-3 text-left font-semibold">Name</th>
                      <th className="p-3 text-left font-semibold">Amount</th>
                      <th className="p-3 text-left font-semibold">Status</th>
                      <th className="p-3 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length ? (
                      currentData.map((l) => (
                        <tr key={l.id}>
                          <td className="p-3 text-left border-t">
                            <span>{l.business_name}</span>
                          </td>
                          <td className="p-3 text-left border-t">
                            <span>{l.name}</span>
                          </td>
                          <td className="p-3 text-left border-t">
                            <span>Rp {formatRupiah(l.amount)}</span>
                          </td>
                          <td className="p-3 text-left border-t">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full border ${l.status === "pending" ? "bg-amber-100 text-amber-500 border-amber-200" : l.status === "approved" ? "bg-blue-100 text-blue-500 border-blue-200" : l.status === "success" ? "bg-green-100 text-green-500 border-green-200" : "bg-red-100 text-red-500 border-red-200"}`}
                            >
                              {l.status}
                            </span>
                          </td>
                          <td className="p-3 text-left border-t">
                            <span>
                              <Link to={`/loan/${l.id}`}>
                                <Button>
                                  <Eye /> More
                                </Button>
                              </Link>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center p-3 py-5 text-muted-foreground"
                        >
                          No data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <Pagination className="mt-15">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setcurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setcurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setcurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
