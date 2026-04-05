export function TableInstallments({ loans }) {
  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value || 0);
  }

  return (
    <div className="space-y-2">
      <h1 className="font-medium">Installments</h1>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full min-w-175">
          <thead className="bg-gray-400">
            <tr>
              <th className="p-3 text-left font-semibold">Interest</th>
              <th className="p-3 text-left font-semibold">Principal</th>
              <th className="p-3 text-left font-semibold">Amount</th>
              <th className="p-3 text-left font-semibold">Remaining</th>
              <th className="p-3 text-left font-semibold">Due Date</th>
              <th className="p-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {loans?.installments?.map((i) => (
              <tr key={i.id}>
                <td className="p-3 text-left border-t text-sm">
                  <span>Rp {formatRupiah(i.interest)}</span>
                </td>
                <td className="p-3 text-left border-t text-sm">
                  <span>Rp {formatRupiah(i.principal)}</span>
                </td>
                <td className="p-3 text-left border-t text-sm">
                  <span>Rp {formatRupiah(i.amount)}</span>
                </td>
                <td className="p-3 text-left border-t text-sm">
                  <span>Rp {formatRupiah(i.remaining_balance)}</span>
                </td>
                <td className="p-3 text-left border-t text-sm">
                  <span>{i.due_date}</span>
                </td>
                <td className="p-3 text-left border-t text-sm">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full border ${i.status === "pending" ? "bg-amber-100 text-amber-500 border-amber-200" : "bg-green-100 text-green-500 border-green-200"}`}
                  >
                    {i.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
