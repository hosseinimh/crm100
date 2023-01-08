<?php

namespace App\Http\Controllers;

use App\Http\Requests\Unit\IndexUnitsRequest as IndexRequest;
use App\Http\Requests\Unit\StoreUnitRequest as StoreRequest;
use App\Http\Requests\Unit\UpdateUnitRequest as UpdateRequest;
use App\Interfaces\UnitRepositoryInterface;
use App\Models\Department;
use App\Models\Unit as Model;
use App\Services\JsonResponse;
use Illuminate\Http\JsonResponse as HttpJsonResponse;

class UnitController extends Controller
{
    public function __construct(JsonResponse $response, private UnitRepositoryInterface $repository)
    {
        parent::__construct($response);
    }

    public function index(Department $department, IndexRequest $request): HttpJsonResponse
    {
        return $this->onItems($this->repository->paginate($department, $request->_pn, $request->_pi));
    }

    public function show(Model $model): HttpJsonResponse
    {
        return $this->onItem($model);
    }

    public function store(Department $department, StoreRequest $request): HttpJsonResponse
    {
        return $this->onStore($this->repository->store($department, $request->title));
    }

    public function update(Model $model, UpdateRequest $request): HttpJsonResponse
    {
        return $this->onUpdate($this->repository->update($model, $request->title));
    }
}
