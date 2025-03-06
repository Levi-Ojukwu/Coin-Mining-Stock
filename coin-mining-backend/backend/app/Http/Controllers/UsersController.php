<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
// use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UsersController extends Controller 
{
    //Function to Register a User
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' =>  'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'country' => 'nullable|string|max:225',
            'phone_number' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|max:15',
        ]);

        if($validator->fails()) {
            return response()->json(['error'=>$validator->errors()] ,422);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'username' => $request->get('username'),
            'email' => $request->get('email'),
            'country' => $request->get('country'),
            'phone_number' => $request->get('phone_number'),
            'password' => Hash::make($request->get('password')),
            'role' => 'user',

        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User Registered',
            'user' => $user,
            'token' => $token

        ], 201);
    }

    // Function to Login
    public function login(Request $request)
    { 

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|max:15|min:6',
        ]);

        $user = User::where("email", $request->email)->first();

        if (!$user)
        {
            return response()->json([
                'error' => 'Invalid Email'
            ], 401);
        } elseif (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Incorrect Password'
            ], 401);
        }

            if($validator->fails()) {
                return response()->json(['error'=>$validator->errors(),422]);
            }

            if ($user->role !== 'user') {
                return response()->json(['error' => 'Unauthorized Access'], 403);
            }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Login Successfully',
            'user' => $user->makeHidden('password'),
            'token' => $token

        ], 201);
    }

    //User Dashboard Function
    public function dashboard(Request $request)
    {
        try {

            /** @var \Illuminate\Contracts\Auth\Authenticatable|null $user */

            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'error' => 'User not found'
                ], 404);
            }

            // Only get visible transactions for the user
            $transactions = Transaction::where('user_id', $user->id)
            ->where('visible_to_user', true) // Only show visible transactions
            ->latest()
            ->take(10)
            ->get();

            $totalBalance = User::sum('balance');

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username,
                    'phone_number' => $user->phone_number,
                    'role' => $user->role,
                    'balance' => $user->balance,
                    'total_withdrawal' => $user->total_withdrawal
                ],
                'balance' => $user->balance,
                'totalBalance' => $totalBalance,
                'transactions' => $transactions,
        ]);
            
        } catch (\Exception $e) {
            Log::error('Dashboard error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to fetch dashboard data: ' . $e->getMessage()
            ], 500);
        }
    }

    //Function to logout
    public function logout(Request $request)
{
    try {
        $token = JWTAuth::getToken();

        if (!$token) {
            return response()->json(['error' => 'Token not provided'], 401);
        }

        JWTAuth::invalidate($token);
        return response()->json(['message' => 'Logout Successfully'], 200); // ✅ Return 200 for success
    } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
        return response()->json(['error' => 'Failed to logout'], 401);
    }
}

}
