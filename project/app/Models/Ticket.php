<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_tickets';

    protected $fillable = [
        'type',
        'creator_id',
        'admin_created',
        'unit_id',
        'subject',
        'status',
    ];

    protected static function booted()
    {
        static::deleting(function ($ticket) {
            foreach ($ticket->threads as $thread) {
                $thread->delete();
            }
        });
    }

    public function threads()
    {
        return $this->hasMany(TicketThread::class, 'ticket_id')->orderBy('id', 'ASC');
    }
}
