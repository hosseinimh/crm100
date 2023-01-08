<?php

namespace App\Http\Controllers;

use App\Constants\ErrorCode;
use App\Constants\StoragePath;
use App\Constants\TicketStatuses;
use App\Http\Requests\Ticket\IndexTicketsRequest as IndexRequest;
use App\Http\Requests\Ticket\StoreTicketRequest as StoreRequest;
use App\Http\Requests\Ticket\StoreTicketThreadRequest;
use App\Http\Resources\TicketResource;
use App\Http\Resources\TicketThreadResource;
use App\Interfaces\TicketRepositoryInterface;
use App\Models\Ticket as Model;
use App\Models\Unit;
use App\Services\JsonResponse;
use Illuminate\Http\JsonResponse as HttpJsonResponse;

class TicketController extends Controller
{
    public function __construct(JsonResponse $response, private TicketRepositoryInterface $repository)
    {
        parent::__construct($response);
    }

    public function indexUser(IndexRequest $request): HttpJsonResponse
    {
        return $this->onItems($this->repository->paginate(auth()->user()->unit_id, $request->_pn, $request->_pi));
    }

    public function indexAdmin(Unit $unit, IndexRequest $request): HttpJsonResponse
    {
        return $this->onItems($this->repository->paginate($unit->id, $request->_pn, $request->_pi));
    }

    public function showUser(Model $model): HttpJsonResponse
    {
        if (!$model->admin_created && $model->unit_id === auth()->user()->unit_id) {
            $items = ['item' => new TicketResource($model), 'threads' => TicketThreadResource::collection($this->repository->threads($model->id))];

            return $this->onOk($items);
        }

        return $this->onItem(null);
    }

    public function showAdmin(Model $model): HttpJsonResponse
    {
        $items = ['item' => new TicketResource($model), 'threads' => TicketThreadResource::collection($this->repository->threads($model->id))];

        return $this->onOk($items);
    }

    public function storeUser(StoreRequest $request): HttpJsonResponse
    {
        if (($thread = $this->repository->store(auth()->user()->unit_id, $request->type, auth()->user()->id, 0, $request->subject, $request->content, TicketStatuses::OPEN))) {
            $response = [];
            $uploadResult = (new FileUploaderController(StoragePath::TICKET_THREAD_FILE))->uploadFile($thread, $request, 'file', 'file');
            $response['uploaded'] = $uploadResult['uploaded'];
            $response['uploadedText'] = $uploadResult['uploadedText'];

            return $this->onOk($response);
        }

        return $this->onError(['_error' => __('general.store_error'), '_errorCode' => ErrorCode::STORE_ERROR]);
    }

    public function storeAdmin(Unit $unit, StoreRequest $request): HttpJsonResponse
    {
        return $this->onStore($this->repository->store($unit->id, $request->type, auth()->user()->id, 1, $request->subject, $request->content, TicketStatuses::CLOSED));
    }

    public function storeThreadUser(Model $model, StoreTicketThreadRequest $request): HttpJsonResponse
    {
        if (($model->unit_id === auth()->user()->unit_id) && ($model->status === TicketStatuses::OPEN) && ($thread = $this->repository->storeThread($model->id, auth()->user()->id, 0, $request->content))) {
            $response = [];
            $uploadResult = (new FileUploaderController(StoragePath::TICKET_THREAD_FILE))->uploadFile($thread, $request, 'file', 'file');
            $response['uploaded'] = $uploadResult['uploaded'];
            $response['uploadedText'] = $uploadResult['uploadedText'];

            return $this->onOk($response);
        }

        return $this->onError(['_error' => __('general.store_error'), '_errorCode' => ErrorCode::STORE_ERROR]);
    }

    public function storeThreadAdmin(Model $model, StoreTicketThreadRequest $request): HttpJsonResponse
    {
        if ($model->status === TicketStatuses::OPEN) {
            return $this->onStore($this->repository->storeThread($model->id, auth()->user()->id, 1, $request->content));
        }

        return $this->onError(['_error' => __('general.store_error'), '_errorCode' => ErrorCode::STORE_ERROR]);
    }

    public function seenUser(Model $model): HttpJsonResponse
    {
        if ($model->unit_id === auth()->user()->unit_id) {
            return $this->onUpdate($this->repository->seen($model->id, false));
        }

        return $this->onError(['_error' => __('general.update_error'), '_errorCode' => ErrorCode::UPDATE_ERROR]);
    }

    public function seenAdmin(Model $model): HttpJsonResponse
    {
        return $this->onUpdate($this->repository->seen($model->id, true));
    }

    public function changeStatus(Model $model): HttpJsonResponse
    {
        if ($model->unit_id === auth()->user()->unit_id) {
            return $this->onUpdate($this->repository->changeStatus($model, TicketStatuses::CLOSED));
        }

        return $this->onError(['_error' => __('general.update_error'), '_errorCode' => ErrorCode::UPDATE_ERROR]);
    }
}
