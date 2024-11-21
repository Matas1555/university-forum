<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        using: function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));
        },
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                ], 401);
            }
        });
        $exceptions->render(function (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e, Request $request) {
            return response()->json([
                'error' => 'Token has expired',
            ], 401);
        });
        $exceptions->render(function (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e, Request $request) {
            return response()->json([
                'error' => 'Token is invalid',
            ], 401);
        });$exceptions->render(function (\Tymon\JWTAuth\Exceptions\JWTException $e, Request $request) {
            return response()->json([
                'error' => 'Token is missing or malformed',
            ], 401);
        });
    })->create();
