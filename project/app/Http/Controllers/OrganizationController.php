<?php

namespace App\Http\Controllers;

use App\Http\Requests\Organization\IndexOrganizationsRequest as IndexRequest;
use App\Http\Requests\Organization\StoreOrganizationRequest as StoreRequest;
use App\Http\Requests\Organization\UpdateOrganizationRequest as UpdateRequest;
use App\Interfaces\OrganizationRepositoryInterface;
use App\Models\Organization as Model;
use App\Services\JsonResponse;
use Illuminate\Http\JsonResponse as HttpJsonResponse;

class OrganizationController extends Controller
{
    public function __construct(JsonResponse $response, private OrganizationRepositoryInterface $repository)
    {
        parent::__construct($response);
    }

    public function index(IndexRequest $request): HttpJsonResponse
    {
        return $this->onItems($this->repository->paginate($request->_pn, $request->_pi));
    }

    public function show(Model $model): HttpJsonResponse
    {
        return $this->onItem($model);
    }

    public function store(StoreRequest $request): HttpJsonResponse
    {
        return $this->onStore($this->repository->store($request->title));
    }

    public function update(Model $model, UpdateRequest $request): HttpJsonResponse
    {
        return $this->onUpdate($this->repository->update($model, $request->title));
    }
}
