<?php

namespace App\Http\Controllers;

use App\Http\Requests\Department\IndexDepartmentsRequest as IndexRequest;
use App\Http\Requests\Department\StoreDepartmentRequest as StoreRequest;
use App\Http\Requests\Department\UpdateDepartmentRequest as UpdateRequest;
use App\Interfaces\DepartmentRepositoryInterface;
use App\Models\Organization;
use App\Models\Department as Model;
use App\Services\JsonResponse;
use Illuminate\Http\JsonResponse as HttpJsonResponse;

class DepartmentController extends Controller
{
    public function __construct(JsonResponse $response, private DepartmentRepositoryInterface $repository)
    {
        parent::__construct($response);
    }

    public function index(Organization $organization, IndexRequest $request): HttpJsonResponse
    {
        return $this->onItems($this->repository->paginate($organization, $request->_pn, $request->_pi));
    }

    public function show(Model $model): HttpJsonResponse
    {
        return $this->onItem($model);
    }

    public function store(Organization $organization, StoreRequest $request): HttpJsonResponse
    {
        return $this->onStore($this->repository->store($organization, $request->title));
    }

    public function update(Model $model, UpdateRequest $request): HttpJsonResponse
    {
        return $this->onUpdate($this->repository->update($model, $request->title));
    }
}
