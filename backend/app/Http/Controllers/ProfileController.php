<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth('api')->user();

        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile, 200);
    }

    public function update(Request $request)
    {
        $user = auth('api')->user();

        // Validate the request data
        $validatedData = $request->validate([
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string', // Assuming avatar is a URL or file path
            'university' => 'nullable|int',
            'course' => 'nullable|string',
        ]);

        // Find or create the profile for the authenticated user
        $profile = $user->profile ?? new Profile(['user_id' => $user->id]);

        // Update the profile with validated data
        $profile->fill($validatedData);
        $profile->save();

        return response()->json(['message' => 'Profile updated successfully', 'profile' => $profile], 200);
    }
}
