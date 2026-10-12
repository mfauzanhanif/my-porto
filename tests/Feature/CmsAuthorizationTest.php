<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

test('guest is redirected to login when attempting to access cms dashboard', function () {
    $this->assertGuest();

    $response = $this->get('/dashboard');

    $response->assertRedirect('/login');
});

test('authenticated admin user can access cms dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard', false)
    );
});

test('guest is protected from accessing cms admin profile route', function () {
    $hasAdminProfile = Route::has('admin.profile.edit')
        || Route::has('admin.profile')
        || collect(Route::getRoutes()->get('GET'))->has('admin/profile');

    if (! $hasAdminProfile) {
        $this->markTestSkipped('Admin profile route (/admin/profile) is pending Milestone M3 implementation.');
    }

    $response = $this->get('/admin/profile');
    $response->assertRedirect('/login');
});

test('guest is protected from accessing cms admin projects routes', function () {
    $hasAdminProjects = Route::has('admin.projects.index')
        || Route::has('admin.projects')
        || collect(Route::getRoutes()->get('GET'))->has('admin/projects');

    if (! $hasAdminProjects) {
        $this->markTestSkipped('Admin projects route (/admin/projects) is pending Milestone M3 implementation.');
    }

    $response = $this->get('/admin/projects');
    $response->assertRedirect('/login');
});

test('guest is protected from accessing cms admin articles routes', function () {
    $hasAdminArticles = Route::has('admin.articles.index')
        || Route::has('admin.articles')
        || collect(Route::getRoutes()->get('GET'))->has('admin/articles');

    if (! $hasAdminArticles) {
        $this->markTestSkipped('Admin articles route (/admin/articles) is pending Milestone M3 implementation.');
    }

    $response = $this->get('/admin/articles');
    $response->assertRedirect('/login');
});

test('guest cannot submit post requests to admin endpoints', function () {
    $response = $this->post('/admin/projects', [
        'title' => 'Unauthorized Exploit Project',
    ]);

    // Either redirected to login or 404/405 if route not yet bound
    $this->assertTrue(in_array($response->status(), [302, 404, 405]));
    if ($response->status() === 302) {
        $response->assertRedirect('/login');
    }
});

test('authenticated session on dashboard receives shared user authentication state', function () {
    $user = User::factory()->create([
        'name' => 'M Fauzan Hanif',
        'email' => 'fauzanhanif2112@gmail.com',
    ]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertOk();
    $this->assertAuthenticatedAs($user);
});
