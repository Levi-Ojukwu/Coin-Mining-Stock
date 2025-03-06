<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        try {
            $token = JWTAuth::getToken();
            $user = JWTAuth::toUser($token);

            if (!$user || !in_array($user->role, $roles)) {
                return response()->json(['error' => 'Unauthorized. Invalid role.'], 403);
            }

            return $next($request);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }
}

