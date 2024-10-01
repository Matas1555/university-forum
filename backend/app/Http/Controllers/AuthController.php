<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function __construct()
    {
       // $this->middleware('auth:api', ['except' => ['login','register']]);
    }
    /**
     * @OA\Get(
     *     path="/auth/login",
     *     summary="Authenticate user and generate JWT token",
     *     tags={"Authentication"},
     *     @OA\Parameter(
     *         name="username",
     *         in="query",
     *         description="User's email",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="password",
     *         in="query",
     *         description="User's password",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *     response="200",
     *     description="Login successful",
     *     @OA\JsonContent(ref="#/components/schemas/User")),
     *     @OA\Response(response="401", description="Invalid credentials")
     * )
     */
    public function login(Request $request)
    {
        Log::info('Login attempt', ['username' => $request->username]);

        $request->merge([
            'email' => $request->username,
        ]);

        // Hardcoded login attempt
        if ($request->username === 'a' && $request->password === 'b') {
            $credentials = ['email' => 'test@ktu.lt', 'password' => 'Testing1'];
            Log::info('Hardcoded login credentials used', ['credentials' => $credentials]);

            $token = auth()->attempt($credentials);
            $user = auth()->user();

            if ($token) {
                return response()->json([
                    'jwt' => $token,
                    'userTitle' => $user['name'],
                    'userId' => 1,
                    'status' => 'success'
                ]);
            } else {
                Log::warning('Hardcoded login credentials do not match database records.');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Hardcoded credential does not match database records',
                ], 401);
            }
        }

        // Validate request
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        // Attempt login with credentials
        $token = auth()->attempt($credentials);
        if (!$token) {
            Log::error('Login failed, invalid credentials', ['credentials' => $credentials]);
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        // Retrieve user after successful authentication
        $user = auth()->user();
        if (!$user) {
            Log::error('No user authenticated after attempting login', ['credentials' => $credentials]);
            return response()->json([
                'status' => 'error',
                'message' => 'User not found after authentication',
            ], 401);
        }

        // Create token for the authenticated user
        $token = $user->createToken('karkasai')->plainTextToken;
        return response()->json([
            'jwt' => $token,
            'userTitle' => $user['name'],
            'userId' => $user->id,
            'status' => 'success'
        ]);
    }


    public function register(Request $request){
        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = auth()->login($user);
        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'user' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function logout()
    {
        auth()->logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => auth()->user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }

}
