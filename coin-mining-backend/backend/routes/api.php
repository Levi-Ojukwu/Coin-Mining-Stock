<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\AdminController;
// use App\Http\Controllers\AdminUserController;


// Routes For Admin Authentication
Route::prefix('admin')->group(function () {
    Route::post('/register', [AdminController::class, 'register'])->name('admin.register');
    Route::post('/login', [AdminController::class, 'login'])->name('admin.login');

    Route::middleware('auth:admin-api')->group(function () {
        Route::post('/logout', [AdminController::class, 'logout'])->name('admin.logout');
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::post('/users/{userId}/update-balance', [AdminController::class, 'updateUserBalance']); // Changed from PUT to POST
        Route::post('/users/{userId}/transactions', [AdminController::class, 'addTransaction']);
        Route::get('/users/{userId}/transactions', [AdminController::class, 'getUserTransactions']);
        Route::get('/users/{userId}', [AdminController::class, 'getUserDetails'])->name('admin.getUserDetails');
    });
});

// Routes For User Authentication
Route::post('/register', [UsersController::class, 'register'])->name('user.register');
Route::post('/login', [UsersController::class, 'login'])->name('user.login');

Route::middleware('auth:user-api') -> group(function() {
    Route::get('/dashboard', [UsersController::class, 'dashboard'])->name('dashboard');
    Route::post('/logout', [UsersController::class, 'logout'])->name('logout');
});


