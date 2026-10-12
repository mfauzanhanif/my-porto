<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PublicArticleController;
use App\Http\Controllers\PublicProjectController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Showcase & Portfolio Routes
|--------------------------------------------------------------------------
|
| These routes are publicly accessible without authentication.
| Single round-trip data delivery via Inertia.js.
|
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/projects', [PublicProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{slug}', [PublicProjectController::class, 'show'])->name('projects.show');

Route::get('/articles', [PublicArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{slug}', [PublicArticleController::class, 'show'])->name('articles.show');

/*
|--------------------------------------------------------------------------
| Protected CMS Admin Routes
|--------------------------------------------------------------------------
|
| Guarded by Fortify authentication and email verification.
|
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});
