<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Installment;
use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use function Symfony\Component\Clock\now;

class LoanController extends Controller
{
    public function all()
    {
        $loan = Loan::with('installments', 'documents')->get();

        return response()->json([
            'data' => $loan
        ], 200);
    }

    public function index(Request $request)
    {
        $loan = Loan::where('user_id', $request->user()->id)->with('installments', 'documents')->get();

        return response()->json([
            'data' => $loan
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string',
            'business_name' => 'required|string',
            'purpose' => 'required|string',
            'address' => 'required|string',
            'phone_number' => 'required|string',
            'account_number' => 'required|integer',
            'amount' => 'required|integer',
            'tenor' => 'required|integer',
            'ktp' => 'required|array',
            'ktp.*' => 'file|mimes:png,jpeg,jpg,webp,pdf|max:5120',
            'npwp' => 'required|array',
            'npwp.*' => 'file|mimes:png,jpeg,jpg,webp,pdf|max:5120',
        ]);

        $loan = Loan::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'email' => $request->email,
            'business_name' => $request->business_name,
            'purpose' => $request->purpose,
            'address' => $request->address,
            'phone_number' => $request->phone_number,
            'account_number' => $request->account_number,
            'amount' => $request->amount,
            'tenor' => $request->tenor,
            'request_date' => now(),
        ]);

        $this->generateInstallments($loan);

        $uploadFiles = function ($files, $type) use ($loan) {
            foreach ($files as $file) {
                $name = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('documents', $name, 'public');

                Document::create([
                    'loan_id' => $loan->id,
                    'type'    => $type,
                    'path'    => $path,
                ]);
            }
        };

        if ($request->hasFile('ktp')) {
            $uploadFiles($request->file('ktp'), 'ktp');
        }

        if ($request->hasFile('npwp')) {
            $uploadFiles($request->file('npwp'), 'npwp');
        }

        return response()->json([
            'data' => $loan
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $loan = Loan::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|string',
            'business_name' => 'sometimes|required|string',
            'purpose' => 'sometimes|required|string',
            'address' => 'sometimes|required|string',
            'phone_number' => 'sometimes|required|string',
            'account_number' => 'sometimes|required|integer',
            'amount' => 'sometimes|required|integer',
            'tenor' => 'sometimes|required|integer',
            'ktp' => 'sometimes|required|array',
            'ktp.*' => 'file|mimes:png,jpeg,jpg,webp,pdf|max:5120',
            'npwp' => 'sometimes|required|array',
            'npwp.*' => 'file|mimes:png,jpeg,jpg,webp,pdf|max:5120',
            'delete_documents' => 'sometimes|array',
            'delete_documents.*' => 'integer|exists:documents,id',
        ]);

        if ($loan->status === "approved" || $loan->status === "success") {
            return response()->json([
                'message' => "Cannot update"
            ], 401);
        };

        if ($request->has('delete_documents')) {
            $documents = Document::whereIn('id', $request->delete_documents)
                ->where('loan_id', $loan->id)
                ->get();

            foreach ($documents as $doc) {
                Storage::disk('public')->delete($doc->path);
                $doc->delete();
            }
        }

        $data = $request->only([
            'name',
            'email',
            'business_name',
            'purpose',
            'address',
            'phone_number',
            'account_number',
            'amount',
            'tenor',
        ]);

        $uploadFiles = function ($files, $type) use ($loan) {
            foreach ($files as $file) {
                $name = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('documents', $name, 'public');

                Document::create([
                    'loan_id' => $loan->id,
                    'type'    => $type,
                    'path'    => $path,
                ]);
            }
        };

        if ($request->hasFile('ktp')) {
            $uploadFiles($request->file('ktp'), 'ktp');
        }

        if ($request->hasFile('npwp')) {
            $uploadFiles($request->file('npwp'), 'npwp');
        }

        $loan->update($data);
        $loan->installments()->delete();
        $this->generateInstallments($loan->fresh());

        return response()->json([
            'data' => $loan
        ]);
    }

    public function approved(Request $request, $id)
    {
        $loan = Loan::findOrFail($id);

        $request->validate([
            'status' => 'sometimes|required'
        ]);

        if (!$request->user() || $request->user()->role !== "admin") {
            return response()->json([
                'message' => 'Admin Only'
            ], 403);
        }

        $data = $request->only([
            'status'
        ]);

        $loan->update($data);

        return response()->json([
            'data' => $loan
        ]);
    }

    public function success(Request $request, $id)
    {
        $loan = Loan::findOrFail($id);

        $request->validate([
            'status' => 'sometimes|required'
        ]);

        if (!$request->user() || $request->user()->role !== "manager") {
            return response()->json([
                'message' => 'Admin Only'
            ], 403);
        }

        $data = $request->only([
            'status'
        ]);

        $loan->update($data);

        return response()->json([
            'data' => $loan
        ]);
    }

    public function destroy($id)
    {
        $loan = Loan::findOrFail($id);

        if ($loan->status === "approved" || $loan->status === "success") {
            return response()->json([
                'message' => 'Cannot delete'
            ]);
        }

        $loan->delete();

        return response()->json([
            'message' => 'Loan deleted'
        ]);
    }

    public function generateInstallments($loan)
    {
        $P = $loan->amount;      // total pinjaman
        $n = $loan->tenor;       // jumlah bulan
        $r = 0.12 / 12;           // bunga 0.12% per tahun → per bulan

        $A = $P * ($r * pow(1 + $r, $n)) / (pow(1 + $r, $n) - 1);

        $balance = $P;

        for ($i = 1; $i <= $n; $i++) {

            $interest = $balance * $r;
            $principal = $A - $interest;
            $balance = $balance - $principal;

            Installment::create([
                'loan_id' => $loan->id,
                'installment_number' => $i,
                'due_date' => Carbon::now()->addMonths($i),
                'amount' => round($A, 2),
                'principal' => round($principal, 2),
                'interest' => round($interest, 2),
                'remaining_balance' => round(max($balance, 0), 2),
                'status' => 'pending'
            ]);
        }
    }
}
