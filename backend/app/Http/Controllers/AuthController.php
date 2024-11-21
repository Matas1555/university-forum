<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Profile;
use App\Models\Role;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;


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
       $profile = Profile::where('user_id', $user->id)->first();



       $refreshToken = auth('api')->claims(['refresh' => true])->tokenById($user->id);

        // Add role information to the access token
        $accessToken = JWTAuth::claims(['role' => $user->role->name])->fromUser($user);

       return $this->respondWithToken($accessToken, $refreshToken, $profile);
    }

    public function register(RegisterRequest $request): \Illuminate\Http\JsonResponse
    {
        try{
            $data = $request->validated();

            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role_id' => 2
            ]);

            $profile = Profile::create([
                'user_id' => $user->id,
                'username' => $data['username'],
                'email' => $data['email'],
                'university' => $data['university'] ?? null,
                'yearOfGraduation' => $data['yearOfGraduation'] ?? null,
                'avatar' => $data['avatar'] ?? null,
                'bio' => $data['bio'] ?? null,
            ]);

            $token = JWTAuth::claims(['role' => "User"])->fromUser($user);

            $refreshToken = auth('api')->claims(['refresh' => true])->tokenById($user->id);

            return $this->respondWithToken($token, $refreshToken, $profile);
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
        $profile = Profile::where('user_id', $user->id)->first();

        return response()->json([
            'user' => $profile
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
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token, $refreshToken, $profile)
    {
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'user' => $profile,
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
            // Use the refresh token to get a new access token
            $newToken = auth('api')->setToken($refreshToken)->refresh();

            $user = auth('api')->user();
            $profile = Profile::where('user_id', $user->id)->first();

            return response()->json([
                'access_token' => $newToken,
                'token_type' => 'bearer',
                'user' => $profile,
                'expires_in' => auth('api')->factory()->getTTL(),
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
    }
}
