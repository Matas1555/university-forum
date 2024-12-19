<?php

namespace App\Http\Middleware;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Closure;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        try {
            // Parse and authenticate the token
            $user = JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token is invalid or missing'], 401);
        }

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Retrieve the user's role (adjust this based on your role structure)
        $userRole = $user->role->name ?? null;

        // If the user's role is not among the required roles, deny access
        if (!in_array($userRole, $roles)) {
            return response()->json(['error' => 'Forbidden: Insufficient permissions.'], 403);
        }

        return $next($request);
    }
}
