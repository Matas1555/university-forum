<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class AuthController extends Controller
{
    public function test(Request $request)
    {
        return "test reached";
    }

    public function login(LoginRequest $request): \Illuminate\Foundation\Application|\Illuminate\Http\Response|\Illuminate\Http\JsonResponse|\Illuminate\Contracts\Routing\ResponseFactory
    {
        $data = $request->validated();

        if(!Auth::attempt($data)) {
            return response([
                'message' => 'email or password is incorrect'
            ]);
        }

        $user = Auth::user();
        Log::info('Authenticated user', ['user' => $user]);

        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function register(RegisterRequest $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validated();

        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request): \Illuminate\Foundation\Application|\Illuminate\Http\Response|\Illuminate\Contracts\Routing\ResponseFactory
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response('Successfully logged out', 204);
    }
}
