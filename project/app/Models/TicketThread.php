<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketThread extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_ticket_threads';

    protected $fillable = [
        'ticket_id',
        'creator_id',
        'admin_created',
        'content',
        'user_seen_time',
        'admin_seen_time',
        'file',
    ];

    protected static function booted()
    {
        static::deleting(function ($thread) {
            if ($thread->file) {
                @unlink(storage_path('app') . '/public/storage/tickets/threads/' . $thread->file);
            }
        });
    }
}
