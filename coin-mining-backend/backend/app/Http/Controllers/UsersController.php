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
use App\Mail\MailSent;

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
                'password' => 'required|string|min:8',
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

            // <CHANGE> Queue registration email with better error handling
            try {
                $this->sendRegistrationEmail($user);
                Log::info('Registration email queued for: ' . $user->email);
            } catch (\Exception $e) {
                Log::error('Failed to queue registration email: ' . $e->getMessage(), [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'exception' => $e
                ]);
            }

            // Create admin notification for new user registration
            try {
                AdminNotificationService::createUserRegistrationNotification($user);
            } catch (\Exception $e) {
                Log::error('Failed to create admin notification: ' . $e->getMessage());
            }

            // Generate JWT token
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully. A welcome email has been sent to your email address.',
                'data' => [
                    'user' => $user,
                    'token' => $token
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('User registration failed: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed. Please try again.'
            ], 500);
        }
    }

    // Function to Login
    public function login(Request $request)
    { 
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|max:15|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Find user by email
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                Log::warning('Login attempt with non-existent email: ' . $request->email);
                return response()->json([
                    'status' => 'error',
                    'error' => 'Invalid Email'
                ], 401);
            }

            // Check password
            if (!Hash::check($request->password, $user->password)) {
                Log::warning('Failed login attempt for user: ' . $user->email);
                return response()->json([
                    'status' => 'error',
                    'error' => 'Incorrect Password'
                ], 401);
            }

            // Check if user has proper role
            if ($user->role !== 'user') {
                Log::warning('Unauthorized login attempt - user role: ' . $user->role);
                return response()->json([
                    'status' => 'error',
                    'error' => 'Unauthorized Access'
                ], 403);
            }

            // Generate JWT token
            $token = JWTAuth::fromUser($user);

            // Notify admin that this user logged in
            try {
                AdminNotificationService::createUserLoginNotification($user);
            } catch (\Exception $e) {
                Log::error('Failed to create admin login notification: ' . $e->getMessage());
            }

            // <CHANGE> Queue login notification email with better error handling
            try {
                $this->sendLoginNotificationEmail($user);
                Log::info('Login notification email queued for: ' . $user->email);
            } catch (\Exception $e) {
                Log::error('Failed to queue login notification email: ' . $e->getMessage(), [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'exception' => $e
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Login Successfully',
                'user' => $user->makeHidden('password'),
                'token' => $token
            ], 200);

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'status' => 'error',
                'error' => 'An error occurred during login'
            ], 500);
        }
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

            // Get user notifications (limit to 2 most recent)
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
            throw new \Exception('Invalid user email address');
        }

        try {

            $emailData = [
                'subject' => 'Welcome to Coin Mining Stock - Account Created Successfully',
                'name' => $user->name,
                'type' => 'registration',
                'body' => "Welcome to Coin Mining Stock! Your account has been created successfully.",
                'details' => [
                    'Username' => $user->username,
                    'Email' => $user->email,
                    'Country' => $user->country,
                    'Account Status' => 'Active'
                ],
                'message' => 'You can now log in to your account and start exploring our platform.',
                'footer' => 'If you did not create this account, please contact our support team immediately.'
            ];

            Mail::to($user->email)->send(new MailSent($emailData));
            Log::info('Registration email sent to: ' . $user->email);

        } catch (\Exception $e) {
            Log::error('Error sending registration email: ' . $e->getMessage(), [
                'user_email' => $user->email,
                'exception' => $e
            ]);
            throw $e;
        }
    }

    private function sendLoginNotificationEmail($user)
    {
        if (!$user || !$user->email) {
            Log::error('Cannot send login notification email: Invalid user or email');
            throw new \Exception('Invalid user email address');
        }

        try {
            $loginTime = now()->format('F d, Y \a\t H:i A');
            $ipAddress = request()->ip();

            $emailData = [
                'subject' => 'New Login to Your Coin Mining Stock Account',
                'name' => $user->name,
                'type' => 'login',
                'body' => 'We detected a new login to your Coin Mining Stock account.',
                'details' => [
                    'Login Time' => $loginTime,
                    'Email' => $user->email,
                    'IP Address' => $ipAddress ?? 'Unknown'
                ],
                'message' => 'If this login was made by you, no further action is required.',
                'footer' => 'If this was not you, please change your password immediately or contact support.'
            ];

            Mail::to($user->email)->send(new MailSent($emailData));
            Log::info('Login notification email sent to: ' . $user->email);

        } catch (\Exception $e) {
            Log::error('Error sending login notification email: ' . $e->getMessage(), [
                'user_email' => $user->email,
                'exception' => $e
            ]);
            throw $e;
        }
    }

}
