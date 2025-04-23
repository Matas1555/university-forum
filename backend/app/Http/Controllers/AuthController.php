<?php

namespace App\Http\Controllers;
use App\Models\Category;
use App\Models\Forum;
use App\Models\Program;
use App\Models\Status;
use App\Models\University;
use App\Models\User;
use App\Models\Profile;
use App\Models\Role;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Policies\CategoryPolicy;
use App\Policies\ProfilePolicy;
use App\Policies\UserPolicy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Storage;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        // Protect certain routes with 'auth:api' middleware (using JWT)
//        $this->middleware('auth:api', ['except' => [
//            'login', 'register', 'test',
//            'getComments', 'getForums', 'getPostsByForum',
//            'index', 'showPost', 'getStatuses', 'getPrograms'
//        ]]);
    }

    public function test(Request $request)
    {
        return "test reached";
    }

    public function login(LoginRequest $request): \Illuminate\Foundation\Application|\Illuminate\Http\Response|\Illuminate\Http\JsonResponse|\Illuminate\Contracts\Routing\ResponseFactory
    {
        $data = $request->validated();

        if(!$token = auth('api')->attempt($data)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = auth('api')->user();

        $avatarUrl = null;
        if ($user->avatar) {
            $avatarUrl = url('storage/' . $user->avatar);
        }

        $universityName = null;
        if ($user->university_id) {
            $university = University::find($user->university_id);
            if ($university) {
                $universityName = $university->name;
            }
        }

        $refreshToken = auth('api')->claims(['refresh' => true])->tokenById($user->id);

        $accessToken = JWTAuth::claims(['role' => $user->role->name])->fromUser($user);

        return response()->json([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'bio' => $user->bio,
                'university' => $universityName,
                'yearOfGraduation' => $user->yearOfGraduation,
                'status_id' => $user->status_id,
                'avatar_url' => $avatarUrl,
                'reputation' => $user->reputation
            ],
            'expires_in' => auth('api')->factory()->getTTL(),
        ]);
    }

    public function register(RegisterRequest $request): \Illuminate\Http\JsonResponse
    {
        try{
            $data = $request->validated();

            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
            }

            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role_id' => 2, // Default to regular user
                'bio' => $data['bio'] ?? null,
                'university_id' => $data['university_id'] ?? null,
                'yearOfGraduation' => $data['yearOfGraduation'] ?? null,
                'avatar' => $avatarPath,
                'reputation' => 0
            ]);

            $universityName = null;
            if ($user->university_id) {
                $university = University::find($user->university_id);
                if ($university) {
                    $universityName = $university->name;
                }
            }

            $avatarUrl = null;
            if ($avatarPath) {
                $avatarUrl = url('storage/' . $avatarPath);
            }

            $token = JWTAuth::claims(['role' => "User"])->fromUser($user);
            $refreshToken = auth('api')->claims(['refresh' => true])->tokenById($user->id);

            return response()->json([
                'access_token' => $token,
                'refresh_token' => $refreshToken,
                'token_type' => 'bearer',
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'bio' => $user->bio,
                    'university' => $universityName,
                    'yearOfGraduation' => $user->yearOfGraduation,
                    'status_id' => $user->status_id,
                    'avatar_url' => $avatarUrl,
                    'reputation' => $user->reputation
                ],
                'expires_in' => auth('api')->factory()->getTTL(),
            ]);
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = auth('api')->user();

        // Get the user's university name if university_id exists
        $universityName = null;
        if ($user->university_id) {
            $university = University::find($user->university_id);
            if ($university) {
                $universityName = $university->name;
            }
        }

        // Prepare avatar URL
        $avatarUrl = null;
        if ($user->avatar) {
            $avatarUrl = url('storage/' . $user->avatar);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'bio' => $user->bio,
                'university' => $universityName,
                'yearOfGraduation' => $user->yearOfGraduation,
                'status_id' => $user->status_id,
                'avatar_url' => $avatarUrl,
                'reputation' => $user->reputation
            ],
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();

        auth('api')->logout(true);

        return response()->json(['message' => 'Successfully logged out'], 200);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        $token = auth('api')->refresh();
        $user = auth('api')->user();

        // Get university name
        $universityName = null;
        if ($user->university_id) {
            $university = University::find($user->university_id);
            if ($university) {
                $universityName = $university->name;
            }
        }

        // Get avatar URL
        $avatarUrl = null;
        if ($user->avatar) {
            $avatarUrl = url('storage/' . $user->avatar);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'bio' => $user->bio,
                'university' => $universityName,
                'yearOfGraduation' => $user->yearOfGraduation,
                'status_id' => $user->status_id,
                'avatar_url' => $avatarUrl,
                'reputation' => $user->reputation
            ],
            'expires_in' => auth('api')->factory()->getTTL(),
        ]);
    }

    public function refreshToken(Request $request)
    {
        try {
            // Extract the refresh token from the Authorization header
            $refreshToken = $request->header('Authorization');
            if (!$refreshToken) {
                return response()->json(['error' => 'Refresh token is required'], 401);
            }

            $refreshToken = str_replace('Bearer ', '', $refreshToken);

            $newToken = auth('api')->setToken($refreshToken)->refresh();

            $user = auth('api')->user();

            $universityName = null;
            if ($user->university_id) {
                $university = University::find($user->university_id);
                if ($university) {
                    $universityName = $university->name;
                }
            }

            $avatarUrl = null;
            if ($user->avatar) {
                $avatarUrl = url('storage/' . $user->avatar);
            }

            return response()->json([
                'access_token' => $newToken,
                'token_type' => 'bearer',
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'bio' => $user->bio,
                    'university' => $universityName,
                    'yearOfGraduation' => $user->yearOfGraduation,
                    'status_id' => $user->status_id,
                    'avatar_url' => $avatarUrl,
                    'reputation' => $user->reputation
                ],
                'expires_in' => auth('api')->factory()->getTTL(),
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
    }

    private function formatUserData($user, $token = null, $refreshToken = null)
    {
        $universityName = null;
        if ($user->university_id) {
            $university = University::find($user->university_id);
            if ($university) {
                $universityName = $university->name;
            }
        }

        $avatarUrl = null;
        if ($user->avatar) {
            $avatarUrl = url('storage/' . $user->avatar);
        }

        $response = [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'bio' => $user->bio,
                'university' => $universityName,
                'yearOfGraduation' => $user->yearOfGraduation,
                'status_id' => $user->status_id,
                'avatar_url' => $avatarUrl,
                'reputation' => $user->reputation
            ]
        ];

        if ($token) {
            $response['access_token'] = $token;
            $response['token_type'] = 'bearer';
            $response['expires_in'] = auth('api')->factory()->getTTL();
        }

        if ($refreshToken) {
            $response['refresh_token'] = $refreshToken;
        }

        return $response;
    }
}
