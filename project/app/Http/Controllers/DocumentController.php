<?php

namespace App\Http\Controllers;

use App\Constants\ErrorCode;
use App\Constants\StoragePath;
use App\Http\Requests\Document\IndexDocumentsRequest as IndexRequest;
use App\Http\Requests\Document\StoreDocumentRequest as StoreRequest;
use App\Http\Requests\Document\UpdateDocumentRequest as UpdateRequest;
use App\Interfaces\DocumentRepositoryInterface;
use App\Models\Document as Model;
use App\Models\Unit;
use App\Services\JsonResponse;
use Illuminate\Http\JsonResponse as HttpJsonResponse;

class DocumentController extends Controller
{
    public function __construct(JsonResponse $response, private DocumentRepositoryInterface $repository)
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

    public function show(Model $model): HttpJsonResponse
    {
        return $this->onItem($model);
    }

    public function store(Unit $unit, StoreRequest $request): HttpJsonResponse
    {
        if (($document = $this->repository->store($unit, $request->title, $request->description))) {
            $response = [];
            $uploadResult = (new FileUploaderController(StoragePath::DOCUMENT_FILE))->uploadFile($document, $request, 'file', 'file');
            $response['uploaded'] = $uploadResult['uploaded'];
            $response['uploadedText'] = $uploadResult['uploadedText'];

            return $this->onOk($response);
        }

        return $this->onError(['_error' => __('general.store_error'), '_errorCode' => ErrorCode::STORE_ERROR]);
    }

    public function update(Model $model, UpdateRequest $request): HttpJsonResponse
    {
        if ($this->repository->update($model, $request->title, $request->description)) {
            $response = [];
            $uploadResult = (new FileUploaderController(StoragePath::DOCUMENT_FILE))->uploadFile($model, $request, 'file', 'file');
            $response['uploaded'] = $uploadResult['uploaded'];
            $response['uploadedText'] = $uploadResult['uploadedText'];

            return $this->onOk($response);
        }

        return $this->onError(['_error' => __('general.update_error'), '_errorCode' => ErrorCode::UPDATE_ERROR]);
    }
}
