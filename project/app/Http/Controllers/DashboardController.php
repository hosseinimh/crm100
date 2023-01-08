<?php

namespace App\Http\Controllers;

use App\Repositories\TicketRepository;
use App\Repositories\UserRepository;
use App\Services\JsonResponse;
use Illuminate\Http\JsonResponse as HttpJsonResponse;

class DashboardController extends Controller
{
    public function __construct(JsonResponse $response)
    {
        parent::__construct($response);
    }

    public function reviewUser(): HttpJsonResponse
    {
        $items = ['tickets' => (new TicketRepository())->countUnseen(auth()->user()->unit_id)];

        return $this->onItems($items);
    }

    public function reviewAdmin(): HttpJsonResponse
    {
        $items = ['users' => (new UserRepository())->countAll(), 'tickets' => (new TicketRepository())->countAllUnseen()];

        return $this->onItems($items);
    }
}
