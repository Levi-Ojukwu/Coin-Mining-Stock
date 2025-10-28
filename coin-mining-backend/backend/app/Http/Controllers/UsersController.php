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

            // Send welcome registration email
            try {
                $this->sendRegistrationEmail($user);
                Log::info('Welcome email sent successfully to: ' . $user->email);
            } catch (\Exception $e) {
                Log::error('Failed to send registration email to ' . $user->email . ': ' . $e->getMessage());
                // Continue with registration even if email fails
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
                'message' => 'User registered successfully. Welcome email sent to you email address.',
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

            // Send login notification email to user
            try {
                $this->sendLoginNotificationEmail($user);
                Log::info('Login notification email sent successfully to: ' . $user->email);
            } catch (\Exception $e) {
                Log::error('Failed to send login notification email to ' . $user->email . ': ' . $e->getMessage());
                // Continue with login even if email fails
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Login Successfully',
                'user' => $user->makeHidden('password'),
                'token' => $token
            ], 200);

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'error' => 'An error occurred during login: ' . $e->getMessage()
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
            $subject = 'Welcome to Coin Mining Stock - Registration Successful';
            $body = "Dear {$user->name},\n\n";
            $body .= "Thank you for registering with Coin Mining Stock! Your account has been successfully created and is ready to use.\n\n";
            $body .= "Account Details:\n";
            $body .= "Username: {$user->username}\n";
            $body .= "Email: {$user->email}\n";
            $body .= "Country: {$user->country}\n\n";
            $body .= "You can now log in to your account and start exploring our platform.\n\n";
            $body .= "If you did not create this account, please contact our support team immediately.\n\n";
            $body .= "Best regards,\n";
            $body .= "Coin Mining Stock Team\n";
            $body .= "support@coinminingstock.com";

            Mail::raw($body, function ($message) use ($user, $subject) {
                $message->to($user->email)
                    ->subject($subject);
            });

            Log::info('Registration welcome email sent successfully to: ' . $user->email);
        } catch (\Exception $e) {
            Log::error('Error sending registration email to ' . $user->email . ': ' . $e->getMessage());
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
            $subject = 'Coin Mining Stock - Login Notification';
            $loginTime = now()->format('F d, Y \a\t H:i:s');
            
            $body = "Dear {$user->name},\n\n";
            $body .= "We detected a new login to your Coin Mining Stock account.\n\n";
            $body .= "Login Details:\n";
            $body .= "Time: {$loginTime}\n";
            $body .= "Email: {$user->email}\n\n";
            $body .= "Security Notice:\n";
            $body .= "If this login was made by you, no further action is required.\n";
            $body .= "If you did NOT make this login, please:\n";
            $body .= "1. Change your password immediately\n";
            $body .= "2. Contact our support team at support@coinminingstock.com\n\n";
            $body .= "Best regards,\n";
            $body .= "Coin Mining Stock Team\n";
            $body .= "support@coinminingstock.com";

            Mail::raw($body, function ($message) use ($user, $subject) {
                $message->to($user->email)
                    ->subject($subject);
            });

            Log::info('Login notification email sent successfully to: ' . $user->email);
        } catch (\Exception $e) {
            Log::error('Error sending login notification email to ' . $user->email . ': ' . $e->getMessage());
            throw $e;
        }
    }

}
