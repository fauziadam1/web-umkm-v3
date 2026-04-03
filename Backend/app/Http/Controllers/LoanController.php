<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Loan;
use Illuminate\Http\Request;

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
            'purpose' => $request->business_name,
            'address' => $request->business_name,
            'phone_number' => $request->business_name,
            'account_number' => $request->business_name,
            'amount' => $request->business_name,
            'tenor' => $request->business_name,
            'request_date' => now(),
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

        return response()->json([
            'data' => $loan
        ], 201);
    }
}
