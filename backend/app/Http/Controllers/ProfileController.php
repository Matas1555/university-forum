<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function getProfiles()
    {
        $profiles = Profile::all();

        $profiles->each(function ($profile) {
           $profile->university_name = $profile->university->name;
           $profile->status_name = $profile->status->name;
           unset($profile->university_id, $profile->status_id, $profile->status, $profile->university);
        });

        return response()->json($profiles,200);
    }
    public function show()
    {
        $user = auth('api')->user();

        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile, 200);
    }

    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        $validatedData = $request->validate([
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string', // Assuming avatar is a URL or file path
            'university' => 'nullable|int',
            'course' => 'nullable|string',
        ]);

        $profile = $user->profile ?? new Profile(['user_id' => $user->id]);

        $profile->fill($validatedData);
        $profile->save();

        return response()->json(['message' => 'Profile updated successfully', 'profile' => $profile], 200);
    }
    public function destroyProfile(Request $request, $id)
    {
        $profile = Profile::find($id);

        $this->authorize('delete', $profile);



        $profile->delete();

        return response()->json(['message' => 'Profile deleted successfully'], 200);
    }

    public function uploadAvatar(\GuzzleHttp\Psr7\Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Only allow image files
        ]);

        $user = Auth::user();

        // Delete the existing avatar if any
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store the new avatar
        $path = $request->file('avatar')->store('avatars', 'public');

        // Update the user's avatar URL in the database
        $user->avatar = $path;
        $user->save();

        return response()->json(['message' => 'Avatar uploaded successfully!', 'avatar_url' => Storage::url($path)]);
    }

    public function getAvatar()
    {
        $user = Auth::user();

        if (!$user->avatar) {
            return response()->json(['message' => 'No avatar found'], 404);
        }

        $avatarUrl = Storage::url($user->avatar);

        return response()->json(['avatar_url' => $avatarUrl]);
    }
}
