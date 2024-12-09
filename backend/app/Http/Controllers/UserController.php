<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Validation\Rules\Password as RulesPassword;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function getUsers(Request $request){
        $users = User::all();

        $users->each(function($user){
           $user->role_name = $user->role->name;
           unset($user->role, $user->role_id);
        });

        return response()->json($users, 200);
    }

    public function deleteUser(Request $request, $id){
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $this->authorize('delete', $user);

        $profile = Profile::where('user_id', $id)->first();
        $profile->delete();

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    public function updateUser(Request $request, $id) {
        echo($request);
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $this->authorize('update', $user);

        try {
            // Validate the incoming request data
            $validatedData = $request->validate([
                'username' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('users', 'username')->ignore($user->id),
                ],
                'role_id' => 'required|integer|exists:roles,id',
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email')->ignore($user->id),
                ],
                'password' => [
                    'sometimes',
                    RulesPassword::min(8)->letters()->numbers(),
                ],
            ]);

            // Log validated data
            \Log::info('Validated Data: ', $validatedData ?: ['empty']);

            // Check if validated data is empty and return an error response if it is
            if (empty($validatedData)) {
                return response()->json(['message' => 'No data provided for update.'], 400);
            }

            // Hash the password if it exists in the request
            if (isset($validatedData['password'])) {
                $validatedData['password'] = bcrypt($validatedData['password']);
            }

            // Update the user with validated data
            $user->update($validatedData);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation Errors: ', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }



}
