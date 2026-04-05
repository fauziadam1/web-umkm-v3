<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WalletController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [UserController::class, 'me']);

    Route::post('/topup', [WalletController::class, 'topup']);
    Route::get('/wallets', [WalletController::class, 'index']);
    Route::post('/withdraw/{installment}', [WalletController::class, 'withdraw']);

    Route::get('/loans', [LoanController::class, 'all']);
    Route::get('/user/loans', [LoanController::class, 'index']);
    Route::post('/loan', [LoanController::class, 'store']);
    Route::get('/loan/{id}', [LoanController::class, 'byId']);
    Route::put('/loan/{id}', [LoanController::class, 'update']);
    Route::delete('/loan/{id}', [LoanController::class, 'destroy']);
    Route::put('/approve/loan/{id}', [LoanController::class, 'approved']);
    Route::put('/success/loan/{id}', [LoanController::class, 'success']);
    
    Route::delete('/document/{id}', [DocumentController::class, 'destroy']);
});

Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

Route::get('/document/download/{id}', [DocumentController::class, 'download']);
