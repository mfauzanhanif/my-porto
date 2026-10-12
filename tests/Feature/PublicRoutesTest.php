<?php

use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

test('landing page route is accessible to anyone', function () {
    $response = $this->get('/');

    $response->assertOk();
});

test('public projects route is accessible when implemented', function () {
    $hasProjectsRoute = Route::has('projects.index')
        || Route::has('projects')
        || collect(Route::getRoutes()->get('GET'))->has('projects');

    if (! $hasProjectsRoute) {
        $this->markTestSkipped('Public projects route (/projects) is pending Milestone M2 implementation.');
    }

    $response = $this->get('/projects');
    $response->assertOk();
});

test('public articles route is accessible when implemented', function () {
    $hasArticlesRoute = Route::has('articles.index')
        || Route::has('articles')
        || collect(Route::getRoutes()->get('GET'))->has('articles');

    if (! $hasArticlesRoute) {
        $this->markTestSkipped('Public articles route (/articles) is pending Milestone M2 implementation.');
    }

    $response = $this->get('/articles');
    $response->assertOk();
});

test('public article detail route is accessible when implemented', function () {
    $hasArticleDetailRoute = Route::has('articles.show')
        || collect(Route::getRoutes()->get('GET'))->has('articles/{slug}');

    if (! $hasArticleDetailRoute) {
        $this->markTestSkipped('Public article detail route (/articles/{slug}) is pending Milestone M2 implementation.');
    }

    $response = $this->get('/articles/sample-slug');
    // Once implemented, a missing article should either 404 or return valid show page
    $this->assertTrue(in_array($response->status(), [200, 404]));
});

test('non-existent public route returns 404 not found', function () {
    $response = $this->get('/non-existent-opaque-route-999');

    $response->assertNotFound();
});

test('public routes do not expose cms admin layout to guests', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('welcome', false)
    );
});
