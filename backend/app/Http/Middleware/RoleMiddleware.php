<?php

namespace App\Http\Middleware;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Closure;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userRole = $user->role->name ?? null;

        // If the user's role is not among the required roles, deny access
        if (!in_array($userRole, $roles)) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        return $next($request);
    }
}
