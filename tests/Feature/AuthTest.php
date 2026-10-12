<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

test('login page is accessible to unauthenticated guests', function () {
    $response = $this->get('/login');

    $response->assertOk();
});

test('guest can authenticate with valid credentials and redirect to dashboard', function () {
    $user = User::factory()->create([
        'email' => 'fauzanhanif2112@gmail.com',
        'password' => bcrypt('password'),
    ]);

    $response = $this->post('/login', [
        'email' => 'fauzanhanif2112@gmail.com',
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect('/dashboard');
});

test('login attempt with incorrect password fails and retains guest status', function () {
    $user = User::factory()->create([
        'email' => 'fauzanhanif2112@gmail.com',
        'password' => bcrypt('password'),
    ]);

    $response = $this->from('/login')->post('/login', [
        'email' => 'fauzanhanif2112@gmail.com',
        'password' => 'incorrect-secret-123',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors();
    $response->assertRedirect('/login');
});

test('login attempt with non-existent email is rejected', function () {
    $response = $this->from('/login')->post('/login', [
        'email' => 'unknown.developer@example.com',
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
    $response->assertRedirect('/login');
});

test('login validation requires both email and password', function () {
    $response = $this->from('/login')->post('/login', [
        'email' => '',
        'password' => '',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['email', 'password']);
});

test('authenticated user accessing login page is redirected to dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/login');

    $response->assertRedirect('/dashboard');
});

test('authenticated user can successfully logout and is redirected to home', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});

test('rapid failed login attempts trigger rate limiting', function () {
    $user = User::factory()->create();

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});
