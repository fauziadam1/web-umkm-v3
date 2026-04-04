<?php

namespace App\Http\Controllers;

use App\Models\Installment;
use App\Models\Wallet;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        $wallet =  Wallet::where('user_id', $request->user()->id)->get();

        return response()->json([
            'data' => $wallet
        ]);
    }

    public function topup(Request $request)
    {
        $request->validate([
            'balance' => 'required'
        ]);

        $wallet = Wallet::where('user_id', $request->user()->id)->first();

        if (!$wallet) {
            $wallet = new Wallet();
            $wallet->user_id = $request->user()->id;
            $wallet->balance = $request->balance;
        } else {
            $wallet->balance += $request->balance;
        }

        $wallet->save();

        return response()->json([
            'message' => 'Top Up Success',
            'data' => $wallet
        ]);
    }

    public function withdraw(Request $request, $id)
    {
        $wallet = Wallet::where('user_id', $request->user()->id)->first();
        $installment = Installment::findOrFail($id);

        $total = $installment->principal + $installment->interest;

        if ($wallet->balance < $total) {
            return response()->json([
                'message' => 'Saldo tidak cukup'
            ], 400);
        }

        $wallet->balance -= $total;
        $wallet->save();

        $installment->status = "paid";
        $installment->save();

        return response()->json([
            'message' => 'Cicilan dibayar'
        ], 201);
    }
}
