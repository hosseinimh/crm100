<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// not logged users
Route::middleware(['cors'])->group(function () {
    Route::post('users/login', [UserController::class, 'login']);
    Route::post('users/logout', [UserController::class, 'logout']);
});

// 'administrator' type users
Route::middleware(['auth:sanctum', 'auth.administrator'])->group(function () {
    Route::post('dashboard/review_admin', [DashboardController::class, 'reviewAdmin']);

    Route::post('users', [UserController::class, 'index']);
    Route::post('users/show/{user}', [UserController::class, 'showAdmin']);
    Route::post('users/store/{unit}', [UserController::class, 'store']);
    Route::post('users/store_admin', [UserController::class, 'storeAdmin']);
    Route::post('users/update/{user}', [UserController::class, 'update']);
    Route::post('users/change_password/{user}', [UserController::class, 'changePassword']);

    Route::post('organizations/show/{model}', [OrganizationController::class, 'show']);
    Route::post('organizations/store', [OrganizationController::class, 'store']);
    Route::post('organizations/update/{model}', [OrganizationController::class, 'update']);
    Route::post('organizations', [OrganizationController::class, 'index']);

    Route::post('departments/show/{model}', [DepartmentController::class, 'show']);
    Route::post('departments/store/{organization}', [DepartmentController::class, 'store']);
    Route::post('departments/update/{model}', [DepartmentController::class, 'update']);
    Route::post('departments/{organization}', [DepartmentController::class, 'index']);

    Route::post('units/store/{department}', [UnitController::class, 'store']);
    Route::post('units/update/{model}', [UnitController::class, 'update']);
    Route::post('units/{department}', [UnitController::class, 'index']);

    Route::post('documents/show/{model}', [DocumentController::class, 'show']);
    Route::post('documents/store/{unit}', [DocumentController::class, 'store']);
    Route::post('documents/update/{model}', [DocumentController::class, 'update']);
    Route::post('documents/{unit}', [DocumentController::class, 'indexAdmin']);

    Route::post('tickets/show_admin/{model}', [TicketController::class, 'showAdmin']);
    Route::post('tickets/{unit}', [TicketController::class, 'indexAdmin']);
    Route::post('tickets/store/{unit}', [TicketController::class, 'storeAdmin']);
    Route::post('tickets/store_thread_admin/{model}', [TicketController::class, 'storeThreadAdmin']);
    Route::post('tickets/seen/{model}', [TicketController::class, 'seenAdmin']);
});


// 'user' type users
Route::middleware(['auth:sanctum', 'auth.user'])->group(function () {
    Route::post('dashboard/review_user', [DashboardController::class, 'reviewUser']);

    Route::post('users/show', [UserController::class, 'showUser']);

    Route::post('documents', [DocumentController::class, 'indexUser']);

    Route::post('tickets/show_user/{model}', [TicketController::class, 'showUser']);
    Route::post('tickets', [TicketController::class, 'indexUser']);
    Route::post('tickets/store', [TicketController::class, 'storeUser']);
    Route::post('tickets/store_thread_user/{model}', [TicketController::class, 'storeThreadUser']);
    Route::post('tickets/seen/{model}', [TicketController::class, 'seenUser']);
    Route::post('tickets/change_status/{model}', [TicketController::class, 'changeStatus']);
});

// 'user|administrator' type users
Route::middleware(['auth:sanctum', 'auth.logged'])->group(function () {
    Route::post('units/show/{model}', [UnitController::class, 'show']);
});
