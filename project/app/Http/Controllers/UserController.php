<?php

namespace App\Http\Controllers;

use App\Constants\ErrorCode;
use App\Constants\Role;
use App\Http\Requests\User\ChangePasswordRequest;
use App\Http\Requests\User\IndexUsersRequest;
use App\Http\Requests\User\LoginUserRequest as LoginRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Interfaces\UserRepositoryInterface;
use App\Models\Unit;
use App\Models\User;
use App\Services\JsonResponse;
use Illuminate\Http\JsonResponse as HttpJsonResponse;

class UserController extends Controller
{
    public function __construct(JsonResponse $response, private UserRepositoryInterface $repository)
    {
        parent::__construct($response);
    }

    public function index(IndexUsersRequest $request): HttpJsonResponse
    {
        return $this->onItems($this->repository->paginate($request->username, $request->name, $request->name, $request->unit_id ?? null, $request->_pn, $request->_pi));
    }

    public function showUser(): HttpJsonResponse
    {
        return $this->onItem(auth()->user());
    }

    public function showAdmin(User $user): HttpJsonResponse
    {
        return $this->onItem($user);
    }

    public function store(Unit $unit, StoreUserRequest $request): HttpJsonResponse
    {
        return $this->onStore($this->repository->store($request->username, $request->password, $request->name, $request->family, $unit->id, Role::USER));
    }

    public function storeAdmin(StoreUserRequest $request): HttpJsonResponse
    {
        return $this->onStore($this->repository->store($request->username, $request->password, $request->name, $request->family, null, Role::ADMINISTRATOR));
    }

    public function update(User $user, UpdateUserRequest $request): HttpJsonResponse
    {
        return $this->onUpdate($this->repository->update($user, $request->name, $request->family));
    }

    public function changePassword(User $user, ChangePasswordRequest $request): HttpJsonResponse
    {
        return $this->onUpdate($this->repository->changePassword($user, $request->new_password));
    }

    public function login(LoginRequest $request): HttpJsonResponse
    {
        if (!auth()->attempt(['username' => $request->username, 'password' => $request->password])) {
            return $this->onError(['_error' => __('user.user_not_found'), '_errorCode' => ErrorCode::USER_NOT_FOUND]);
        }

        return $this->onItem(auth()->user());
    }

    public function logout(): HttpJsonResponse
    {
        auth()->logout();

        return $this->onOk();
    }
}
