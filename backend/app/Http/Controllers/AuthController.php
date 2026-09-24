<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        // Authenticate using session guard (not Sanctum personal access token)
        Auth::login($user, true);

        return response()->json([
            'user' => $user->safeUser(),
        ]);
    }

    /**
     * Login user.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (!Auth::attempt($validated)) {
            return response()->json(
                ['message' => 'The provided credentials are incorrect.'],
                401
            );
        }

        // Regenerate session
        $request->session()->regenerate();

        $user = Auth::user();

        return response()->json([
            'user' => $user->safeUser(),
        ]);
    }

    /**
     * Logout user.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * Get the authenticated user.
     */
    public function user(): JsonResponse
    {
        return response()->json([
            'user' => Auth::user()->safeUser(),
        ]);
    }
}