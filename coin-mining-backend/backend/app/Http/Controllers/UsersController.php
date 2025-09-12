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
use Illuminate\Support\Facades\Mail;
use App\Services\AdminNotificationService;

class UsersController extends Controller 
{
    //Function to Register a User
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'country' => 'required|string|max:255',
                'phone_number' => 'required|string|max:20',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'country' => $request->country,
                'phone_number' => $request->phone_number,
                'password' => Hash::make($request->password),
                'role' => 'user',
                'balance' => 0.00,
                'total_withdrawal' => 0.00
            ]);

            // Create admin notification for new user registration
            AdminNotificationService::createUserRegistrationNotification($user);

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully',
                'data' => [
                    'user' => $user,
                    'token' => $token
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('User registration failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
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

        // Notify admin that this user logged in
        AdminNotificationService::createUserLoginNotification($user);

        // Send login notification email
        // try {
        //     $this->sendLoginNotificationEmail($user);
        // } catch (\Exception $e) {
        //     Log::error('Failed to send login notification email: ' . $e->getMessage());
        //     // Continue with login even if email fails
        // }

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

            // Create admin notification for user login (only once per session)
                // if (!$request->session()->has('login_notification_sent')) {
                //     AdminNotificationService::createUserLoginNotification($user);
                //     $request->session()->put('login_notification_sent', true);
                // }

            // Only get visible transactions for the user (limit to 5 most recent)
            $recentTransactions = Transaction::where('user_id', $user->id)
                ->where('visible_to_user', true)
                ->latest()
                ->take(5)
                ->get();

            // Get user notifications (limit to 5 most recent)
            $recentNotifications = $user->notifications()
                ->orderBy('created_at', 'desc')
                ->take(2)
                ->get();

            $unreadNotificationsCount = $user->unreadNotifications()->count();

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
                'transactions' => $recentTransactions,
                'recent_notifications' => $recentNotifications,
                'unread_notifications_count' => $unreadNotificationsCount,
        ]);
            
        } catch (\Exception $e) {
            Log::error('Dashboard error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to fetch dashboard data: ' . $e->getMessage()
            ], 500);
        }
    }

    // New method to get all user transactions
    public function getAllTransactions()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'error' => 'User not found'
                ], 404);
            }

            $transactions = Transaction::where('user_id', $user->id)
                ->where('visible_to_user', true)
                ->latest()
                ->get();

            return response()->json([
                'transactions' => $transactions
            ]);
            
        } catch (\Exception $e) {
            Log::error('Get all transactions error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to fetch transactions: ' . $e->getMessage()
            ], 500);
        }
    }

    // New method to delete user transaction
    public function deleteTransaction($transactionId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'error' => 'User not found'
                ], 404);
            }

            $transaction = Transaction::where('id', $transactionId)
                ->where('user_id', $user->id)
                ->where('visible_to_user', true)
                ->first();

            if (!$transaction) {
                return response()->json([
                    'error' => 'Transaction not found or not accessible'
                ], 404);
            }

            $transaction->delete();

            return response()->json([
                'message' => 'Transaction deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Delete transaction error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to delete transaction: ' . $e->getMessage()
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

    // Email notification methods
    private function sendRegistrationEmail($user)
    {
        if (!$user || !$user->email) {
            Log::error('Cannot send registration email: Invalid user or email');
            return;
        }

        $data = [
            'name' => $user->name,
            'email' => $user->email,
            'subject' => 'Welcome to Elite Farm Mine - Registration Successful',
            'body' => "Dear {$user->name},\n\nThank you for registering with Elite Farm Mine. Your account has been successfully created.\n\nUsername: {$user->username}\nEmail: {$user->email}\n\nYou can now log in to your account and start exploring our platform.\n\nBest regards,\nElite Farm Mine Team"
        ];

        Mail::send([], [], function ($message) use ($data) {
            $message->to($data['email'])
                ->subject($data['subject'])
                ->setBody($data['body'], 'text/plain');
        });

        Log::info('Registration email sent to: ' . $user->email);
    }

    // private function sendLoginNotificationEmail($user)
    // {
    //     if (!$user || !$user->email) {
    //         Log::error('Cannot send login notification email: Invalid user or email');
    //         return;
    //     }

    //     $data = [
    //         'name' => $user->name,
    //         'email' => $user->email,
    //         'subject' => 'Elite Farm Mine - Login Notification',
    //         'body' => "Dear {$user->name},\n\nWe detected a new login to your Elite Farm Mine account.\n\nIf this was you, no action is needed. If you did not log in, please contact our support team immediately.\n\nTime: " . now()->format('Y-m-d H:i:s') . "\n\nBest regards,\nElite Farm Mine Team"
    //     ];

    //     Mail::send([], [], function ($message) use ($data) {
    //         $message->to($data['email'])
    //             ->subject($data['subject'])
    //             ->setBody($data['body'], 'text/plain');
    //     });

    //     Log::info('Login notification email sent to: ' . $user->email);
    // }

}
