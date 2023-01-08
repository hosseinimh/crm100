<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_documents';
    protected $fillable = [
        'title',
        'file',
        'unit_id',
        'description'
    ];

    protected static function booted()
    {
    }
}
