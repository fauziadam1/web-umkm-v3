<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function download($id)
    {
        $document = Document::findOrFail($id);

        $path = $document->path;

        if (!Storage::disk('public')->exists($path)) {
            return response()->json([
                'message' => 'File tidak ditemukan'
            ], 404);
        }

        return response()->download(
            storage_path('app/public/' . $path),
            basename($path)
        );
    }
}
