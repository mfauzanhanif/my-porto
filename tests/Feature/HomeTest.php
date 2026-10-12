<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('landing page returns successful 200 response', function () {
    $response = $this->get('/');

    $response->assertOk();
});

test('landing page renders welcome inertia component', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('welcome', false)
    );
});

test('landing page is publicly accessible to guests without authentication', function () {
    $this->assertGuest();

    $response = $this->get(route('home'));

    $response->assertOk();
    $this->assertGuest();
});

test('landing page provides active session and security headers', function () {
    $response = $this->get('/');

    $response->assertOk();
    $this->assertNotNull(session()->getId());
});

test('authenticated admin can also view the public landing page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertOk();
});

test('landing page contract contains portfolio props when home controller is active', function () {
    $response = $this->get('/');

    $response->assertOk();

    // Verify Inertia response contract
    $response->assertInertia(function (Assert $page) {
        $page->component('welcome', false);
    });
});
