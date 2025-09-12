<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Notification;
use App\Models\AdminNotification;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    //Function to register
    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' =>  'required|string|max:255',
            'username' => 'required|string|max:255|unique:admins',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:6|max:15|confirmed',
            'password_confirmation' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json([
                'error'  => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }
        

        try {
            // Check if admin limit is reached
            $adminCount = Admin::count();
            $maxAdmins = 15; // Define the maximum number of admins allowed
            if ($adminCount >= $maxAdmins) {
                return response()->json([
                    'error' => "Maximum number of admins ({$maxAdmins}) has been reached. Cannot register new admin."
                ], 403);
            }
            
            $admin = Admin::create([
                'name' => $request->get('name'),
                'username' => $request->get('username'),
                'email' => $request->get('email'),
                'password' => Hash::make($request->get('password')),
                'role' => 'admin',
            ]);

            return response()->json([
                'message' => 'Admin registered successfully. Please login to continue.',
                'admin' => $admin->makeHidden('password'),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Admin registration failed', [
                'error' => $e->getMessage(),
                'data' => $request->except('password', 'password_confirmation')
            ]);

            return response()->json([
                'error' => 'Registration failed',
                'message' => $e->getMessage()
            ], 500);
        }
        // $token = $admin->createToken('AdminToken')->plainTextToken;
        // $token = JWTAuth::fromUser($admin);
    }

    //Function to login
    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|min:6|max:15|',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $admin = Admin::where('email', $request->email)->first();

        if(!$admin)
        {
            return response()->json([
                'error' => 'Invalid email address'
            ], 401);
        } 
        
        if (!Hash::check($request->password, $admin->password)) {
            return response()->json([
                'error' => 'Incorrect Password'
            ], 401);
        }

        // Ensure only admins can log in
        if ($admin->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized Access'], 403);
        }

        
        // $token = $admin->createToken('AdminToken')->plainTextToken;
        $token = JWTAuth::fromUser($admin);

        if (!$token) {
            return response()->json(['error' => 'Failed to generate token'], 500);
        }

            return response()->json([
                'message' => 'Login Successful',
                'admin' => $admin->makeHidden('password'),
                'token' => $token,
                'dashboard' => $this->getDashboardData()
    
            ], 200);
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
    
    //Function to display dashboard 
    public function dashboard()
    {
        try{
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }
            
            $totalUsers = User::count();
            $totalBalance = User::sum('balance');
            $totalWithdrawals = User::sum('total_withdrawal');

            // Get only 5 most recent users
            $recentUsers = User::orderBy('created_at', 'desc')
                ->take(3)
                ->get(['id', 'name', 'email', 'phone_number', 'balance', 'total_withdrawal', 'created_at']);

            // Get only 5 most recent transactions
            $recentTransactions = Transaction::with('user:id,name,email')
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get();

            // Get only 3 most recent notifications
            $recentNotifications = Notification::with('user:id,name,email')
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get();

            // Get admin notifications unread count
            $adminUnreadNotificationsCount = AdminNotification::where('is_read', false)->count();

             // Get admin stats
            $adminStats = [
                'current_count' => Admin::count(),
                'max_allowed' => 10,
                'slots_available' => 10 - Admin::count()
            ];

            return response()->json([
                'message' => 'Admin Dashboard data retrieved successfully',
                'data' => [
                    'total_users' => $totalUsers,
                    'total_balance' => $totalBalance,
                    'total_withdrawals' => $totalWithdrawals,
                    'recent_users' => $recentUsers,
                    'recent_transactions' => $recentTransactions,
                    'recent_notifications' => $recentNotifications,
                    'admin_unread_notifications_count' => $adminUnreadNotificationsCount,
                    'admin_stats' => $adminStats
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Admin dashboard error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch dashboard data'], 500);
        }
        
    }

    // New method to get all transactions
    public function getAllTransactions()
    {
        try {
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json([
                    'error' => 'Unauthorized access'
                ], 403);
            }

            $transactions = Transaction::with('user:id,name,email')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'message' => 'All transactions retrieved successfully',
                'transactions' => $transactions
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch all transactions: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch transactions'], 500);
        }
    }

    // Function to update user balance
    public function updateUserBalance(Request $request, $userId)
    {
        try {
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json([
                    'error' => 'Unauthorized access'
                ], 403);
            }

            // Validate request data
            $validator = Validator::make($request->all(), [
                'balance' => 'required|numeric|min:0|max:999999999999999999.99',
                'total_withdrawal' => 'required|numeric|min:0|max:999999999999999999.99',
                'user_id' => 'required|integer|exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

             // Ensure the URL parameter matches the body parameter
            if ((int)$userId !== (int)$request->user_id) {
                return response()->json(['error' => 'User ID mismatch between URL and request body'], 400);
            }

            // Find specific user with strict ID check
            $user = User::where('id', '=', $userId)->first();
            if (!$user) {
                return response()->json([
                    'error' => "User with ID {$userId} not found"
                ], 404);
            }

            // Format decimal values properly
            $newBalance = number_format((float)$request->balance, 2, '.', '');
            $newTotalWithdrawal = number_format((float)$request->total_withdrawal, 2, '.', '');

            // Store original values for notification
            $originalBalance = $user->balance;
            $originalWithdrawal = $user->total_withdrawal;

            //Log the update attempt
            Log::info('Update values comparison:', [
                'admin_id' => $admin->id,
                'user_id' => $userId,
                'requested_balance' => $request->balance,
                'formatted_balance' => $newBalance,
                'requested_withdrawal' => $request->total_withdrawal,
                'formatted_withdrawal' => $newTotalWithdrawal
            ]);

            DB::beginTransaction();
            try {

            // Calculate the difference for the transaction
            $balanceDifference = $request->balance - $user->balance;

            // Create balance adjustment transaction if needed
            if (abs($balanceDifference) > 0.01) { // Use small epsilon for float comparison
                $balanceTransaction = new Transaction();
                $balanceTransaction->user_id = $userId;
                $balanceTransaction->type = $balanceDifference > 0 ? 'deposit' : 'withdrawal';
                $balanceTransaction->amount = abs($balanceDifference);
                $balanceTransaction->status = 'completed';
                $balanceTransaction->description = 'Balance adjusted by admin';
                $balanceTransaction->visible_to_user = false;
                $balanceTransaction->save();
            }

            // Create a hidden transaction for withdrawal difference if changed
            $withdrawalDifference = $request->total_withdrawal - $user->total_withdrawal;

            // Create withdrawal adjustment transaction if needed
            if (abs($withdrawalDifference) > 0.01) { // Use small epsilon for float comparison
                $withdrawalTransaction = new Transaction();
                $withdrawalTransaction->user_id = $userId;
                $withdrawalTransaction->type = 'withdrawal';
                $withdrawalTransaction->amount = abs($withdrawalDifference);
                $withdrawalTransaction->status = 'completed';
                $withdrawalTransaction->description = 'Total withdrawal adjusted by admin';
                $withdrawalTransaction->visible_to_user = false;
                $withdrawalTransaction->save();
            }

            // Update the specific user
            $updated = DB::table('users')
                ->where('id', '=', $userId)
                ->update([
                    'balance' => $newBalance,
                    'total_withdrawal' => $newTotalWithdrawal
                ]);
            
                if (!$updated) {
                    throw new \Exception('Failed to update user record');
                }

            // Fetch fresh user data to confirm update
            $updatedUser = User::where('id', '=', $userId)->first();

            // Compare with small epsilon for float values
            if (abs($updatedUser->balance - (float)$newBalance) > 0.01 || 
                abs($updatedUser->total_withdrawal - (float)$newTotalWithdrawal) > 0.01) {
                
                // Log the verification failure details
                Log::error('Update verification failed', [
                    'user_id' => $userId,
                    'expected_balance' => $newBalance,
                    'actual_balance' => $updatedUser->balance,
                    'expected_withdrawal' => $newTotalWithdrawal,
                    'actual_withdrawal' => $updatedUser->total_withdrawal
                ]);
                
                throw new \Exception('Update verification failed - values do not match expected results');
            }

            DB::commit();

            // Create in-app notification instead of sending email
            NotificationService::createBalanceUpdateNotification($updatedUser, $originalBalance, $originalWithdrawal);

            // Log successful update
            Log::info('User balance updated successfully', [
                'user_id' => $userId,
                'new_balance' => $updatedUser->balance,
                'new_total_withdrawal' => $updatedUser->total_withdrawal
            ]);

            return response()->json([
                'message' => 'User balance updated successfully',
                'user' => [
                    'id' => $updatedUser->id,
                    'name' => $updatedUser->name,
                    'email' => $updatedUser->email,
                    'balance' => (float)$updatedUser->balance,
                    'total_withdrawal' => (float)$updatedUser->total_withdrawal
                ]
            ]);

            } catch (\Exception $e) {
                DB::rollback();
                Log::error('Failed to update user balance', [
                    'user_id' => $userId,
                    'error' => $e->getMessage(),
                    'data' => $request->all()
                ]);

                throw $e;
            }
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update balance: ' . $e->getMessage()], 500);
        }
    }

    // Function to get all users
    public function getAllUsers()
    {
        try {
            // Verify admin authentication
            $admin = JWTAuth::parseToken()->authenticate();
            
            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            // Get all users with their balances
            $users = User::select('id', 'name', 'email', 'phone_number', 'balance', 'total_withdrawal')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone_number' => $user->phone_number,
                        'balance' => (float)$user->balance,
                        'total_withdrawal' => (float)$user->total_withdrawal
                    ];
                });

            return response()->json([
                'message' => 'Users retrieved successfully',
                'users' => $users
            ], 200);
            
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token has expired'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Token not provided'], 401);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve all users', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to retrieve users: ' . $e->getMessage()
            ], 500);
        }
    }

    //Function to get user details 
    public function getUserDetails($userId)
    {
        try {
            // Verify admin authentication
        $admin = JWTAuth::parseToken()->authenticate();
        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        // Find the specific user
        $user = User::findOrFail($userId);

        // Return user data with consistent field names
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'balance' => $user->balance ?? 0, // Provide default value if null
            'total_withdrawal' => $user->total_withdrawal ?? 0 // Ensure field name matches
        ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch user details', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to fetch user details: ', [
                    'user_id' => $userId,
                    'error' => $e->getMessage()
                ]
            ], 500);
        }
    }

    //Function to add transaction 
    public function addTransaction(Request $request, $userId)
    {   

        try {
            // Verify admin authentication
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            // Validate request

        // Validate request with maximum amount
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:deposit,withdrawal',
            'amount' => 'required|numeric|max:999999999999999999.99'
        ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            // Check if user exists first
            $user = User::where('id', $userId)->first();

            if (!$user) {
                return response()->json([
                    'error' => "User with ID {$userId} not found"
                ], 404);
            }

            // Log the transaction attempt
            Log::info('Attempting to add transaction', [
                'user_id' => $userId,
                'type' => $request->type,
                'amount' => $request->amount,
                'current_balance' => $user->balance
            ]);

            DB::beginTransaction();
            try {

                // Format amount to ensure proper decimal places
                $amount = number_format((float)$request->amount, 2, '.', '');

                $transaction = new Transaction();
                $transaction->user_id = $userId;
                $transaction->type = $request->type;
                $transaction->amount = $request->amount;
                $transaction->status = 'completed';
                $transaction->description = ucfirst($request->type) . ' recorded by admin';
                $transaction->visible_to_user = true; // Visible to user
                $transaction->save();

                DB::commit();

                // Create in-app notification instead of sending email
                NotificationService::createTransactionNotification($user, $transaction);

                // Log successful transaction
                Log::info('Transaction completed successfully', [
                    'user_id' => $userId,
                    'transaction_id' => $transaction->id,
                    'new_balance' => $user->balance
                ]);

                return response()->json([
                    'message' => 'Transaction added successfully',
                    'transaction' => [
                        'id' => $transaction->id,
                        'type' => $transaction->type,
                        'amount' => $transaction->amount,
                        'status' => $transaction->status,
                        'description' => $transaction->description,
                        'created_at' => $transaction->created_at->format('Y-m-d H:i:s'),
                        'visible_to_user' => $transaction->visible_to_user
                    ],
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'balance' => $user->balance,
                        'total_withdrawal' => $user->total_withdrawal
                    ]
                ], 200);

            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add transaction: ' . $e->getMessage()], 500);
        }
    }

    // NEW METHOD: Process deposit or withdrawal
    public function processUserTransaction(Request $request, $userId)
    {
        try {
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json([
                    'error' => 'Unauthorized access'
                ], 403);
            }

            // Validate request data
            $validator = Validator::make($request->all(), [
                'deposit_amount' => 'nullable|numeric|min:0|max:999999999999999999.99',
                'withdrawal_amount' => 'nullable|numeric|min:0|max:999999999999999999.99',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            // Find the user
            $user = User::where('id', '=', $userId)->first();
            if (!$user) {
                return response()->json([
                    'error' => "User with ID {$userId} not found"
                ], 404);
            }

            $depositAmount = $request->deposit_amount ? (float)$request->deposit_amount : 0;
            $withdrawalAmount = $request->withdrawal_amount ? (float)$request->withdrawal_amount : 0;

            // Validate that at least one amount is provided
            if ($depositAmount <= 0 && $withdrawalAmount <= 0) {
                return response()->json([
                    'error' => 'Please enter either a deposit amount or withdrawal amount'
                ], 422);
            }

            // Store original values for notification
            $originalBalance = $user->balance;
            $originalWithdrawal = $user->total_withdrawal;

            Log::info('Processing user transaction:', [
                'admin_id' => $admin->id,
                'user_id' => $userId,
                'deposit_amount' => $depositAmount,
                'withdrawal_amount' => $withdrawalAmount,
                'current_balance' => $user->balance,
                'current_total_withdrawal' => $user->total_withdrawal
            ]);

            DB::beginTransaction();
            try {
                // Process deposit
                if ($depositAmount > 0) {
                    // Add to user's balance
                    $user->balance += $depositAmount;

                    // Create visible deposit transaction
                    $depositTransaction = new Transaction();
                    $depositTransaction->user_id = $userId;
                    $depositTransaction->type = 'deposit';
                    $depositTransaction->amount = $depositAmount;
                    $depositTransaction->status = 'completed';
                    $depositTransaction->description = 'Deposit processed by admin';
                    $depositTransaction->visible_to_user = true;
                    $depositTransaction->save();

                    Log::info('Deposit transaction created:', [
                        'transaction_id' => $depositTransaction->id,
                        'amount' => $depositAmount
                    ]);
                }

                // Process withdrawal
                if ($withdrawalAmount > 0) {
                    // Check if user has sufficient balance
                    if ($user->balance < $withdrawalAmount) {
                        throw new \Exception("Insufficient balance. Current balance: $" . number_format($user->balance, 2));
                    }

                    // Subtract from user's balance and add to total withdrawal
                    $user->balance -= $withdrawalAmount;
                    $user->total_withdrawal += $withdrawalAmount;

                    // Create visible withdrawal transaction
                    $withdrawalTransaction = new Transaction();
                    $withdrawalTransaction->user_id = $userId;
                    $withdrawalTransaction->type = 'withdrawal';
                    $withdrawalTransaction->amount = $withdrawalAmount;
                    $withdrawalTransaction->status = 'completed';
                    $withdrawalTransaction->description = 'Withdrawal processed by admin';
                    $withdrawalTransaction->visible_to_user = true;
                    $withdrawalTransaction->save();

                    Log::info('Withdrawal transaction created:', [
                        'transaction_id' => $withdrawalTransaction->id,
                        'amount' => $withdrawalAmount
                    ]);
                }

                // Save the updated user
                $user->save();

                DB::commit();

                // Create notification for the user
                NotificationService::createBalanceUpdateNotification($user, $originalBalance, $originalWithdrawal);

                Log::info('User transaction processed successfully:', [
                    'user_id' => $userId,
                    'new_balance' => $user->balance,
                    'new_total_withdrawal' => $user->total_withdrawal
                ]);

                return response()->json([
                    'message' => 'Transaction processed successfully',
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'balance' => (float)$user->balance,
                        'total_withdrawal' => (float)$user->total_withdrawal
                    ],
                    'transactions_created' => [
                        'deposit' => $depositAmount > 0 ? $depositAmount : null,
                        'withdrawal' => $withdrawalAmount > 0 ? $withdrawalAmount : null
                    ]
                ]);

            } catch (\Exception $e) {
                DB::rollback();
                Log::error('Failed to process user transaction:', [
                    'user_id' => $userId,
                    'error' => $e->getMessage(),
                    'data' => $request->all()
                ]);

                throw $e;
            }
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to process transaction: ' . $e->getMessage()], 500);
        }
    }

    // New method to get all notifications
    public function getAllNotifications()
    {
        try {
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json([
                    'error' => 'Unauthorized access'
                ], 403);
            }

            $notifications = Notification::with('user:id,name,email')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'message' => 'All notifications retrieved successfully',
                'notifications' => $notifications
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch all notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch notifications'], 500);
        }
    }

    //Function to delete user
    public function deleteUser($userId)
    {
        try {
            // Verify admin authentication
            $admin = JWTAuth::parseToken()->authenticate();
            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            // Find the user
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Delete the user
            $user->delete();

            return response()->json(['message' => 'User deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to delete user', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);

            return response()->json(['error' => 'Failed to delete user: ' . $e->getMessage()], 500);
        }
    }

    // Function to delete transaction
    public function deleteTransaction($transactionId)
    {
        try {
            // Verify admin authentication
            $admin = JWTAuth::parseToken()->authenticate();
            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            // Find the transaction
            $transaction = Transaction::find($transactionId);
            if (!$transaction) {
                return response()->json(['error' => 'Transaction not found'], 404);
            }

            // Delete the transaction
            $transaction->delete();

            return response()->json(['message' => 'Transaction deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to delete transaction', [
                'transaction_id' => $transactionId,
                'error' => $e->getMessage()
            ]);

            return response()->json(['error' => 'Failed to delete transaction: ' . $e->getMessage()], 500);
        }
    }

    // Function to get user transactions 
    public function getUserTransactions($userId)
    {
        try {
            // Verify admin authentication
            $admin = JWTAuth::parseToken()->authenticate();
            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

             // Check if user exists first
            $user = User::where('id', $userId)->first();

            if (!$user) {
                return response()->json([
                    'error' => "User with ID {$userId} not found"
                ], 404);
            }

                // Get ALL transactions for admin view, including hidden ones
                $transactions = Transaction::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'type' => $transaction->type,
                        'amount' => $transaction->amount,
                        'status' => $transaction->status,
                        'description' => $transaction->description,
                        'created_at' => $transaction->created_at->format('Y-m-d H:i:s'),
                        'visible_to_user' => $transaction->visible_to_user
                    ];
                });

                return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'balance' => $user->balance,
                    'total_withdrawal' => $user->total_withdrawal
                ],
                'transactions' => $transactions
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch user transactions', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch user transactions: ' . $e->getMessage()
            ], 500);
        }
    }

    //Function to get dashboard data  
    private function getDashboardData()
    {
        try {
            $totalUsers = User::count();
            $totalBalance = User::sum('balance');
            $totalWithdrawals = User::sum('total_withdrawal');

            // Get recent users with their latest transactions
            $recentUsers = User::select('id', 'name', 'email', 'phone_number', 'balance', 'total_withdrawal')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone_number' => $user->phone_number,
                        'balance' => (float)$user->balance,
                        'total_withdrawal' => (float)$user->total_withdrawal
                    ];
                });

            // Updated to use the correct relationship name 'transactions'
            $recentUsers = User::with(['transactions' => function($query) {
                $query->latest()->take(5);
            }])->latest()->take(5)->get();

            $transactions = Transaction::with('user')
                ->latest()
                ->take(10)
                ->get()
                ->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'type' => $transaction->type,
                        'amount' => $transaction->amount,
                        'status' => $transaction->status,
                        'description' => $transaction->description,
                        'created_at' => $transaction->created_at->format('Y-m-d H:i:s'),
                        'visible_to_user' => $transaction->visible_to_user,
                        'user' => [
                            'id' => $transaction->user->id,
                            'name' => $transaction->user->name,
                            'email' => $transaction->user->email
                        ]
                    ];
                });

            return [
                'total_users' => $totalUsers,
                'total_balance' => (float)$totalBalance,
                'total_withdrawals' => (float)$totalWithdrawals,
                'recent_users' => $recentUsers,
                'transactions' => $transactions
            ];
            } catch (\Exception $e) {
                Log::error('Error in getDashboardData:', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }
    }

    //Email notification methods
    private function sendBalanceUpdateEmail($user, $originalBalance, $originalWithdrawal)
    {
        if (!$user || !$user->email) {
            Log::error('Cannot send balance update email: Invalid user or email');
            return;
        }

        $data = [
            'name' => $user->name,
            'email' => $user->email,
            'subject' => 'Coin Mining Stock - Account Balance Update',
            'body' => "Dear {$user->name},\n\nYour account balance has been updated by an administrator.\n\nPrevious Balance: $" . number_format($originalBalance, 2) . 
                    "\nNew Balance: $" . number_format($user->balance, 2) . 
                    "\n\nPrevious Total Withdrawal: $" . number_format($originalWithdrawal, 2) . 
                    "\nNew Total Withdrawal: $" . number_format($user->total_withdrawal, 2) . 
                    "\n\nIf you have any questions about this update, please contact our support team.\n\nBest regards,\nCoin Mining Stock Team"
        ];

        Mail::send([], [], function ($message) use ($data) {
            $message->to($data['email'])
                ->subject($data['subject'])
                ->setBody($data['body'], 'text/plain');
        });

        Log::info('Balance update email sent to: ' . $user->email);
    }

    private function sendTransactionNotificationEmail($user, $transaction)
    {
        if (!$user || !$user->email) {
            Log::error('Cannot send transaction notification email: Invalid user or email');
            return;
        }

        $transactionType = ucfirst($transaction->type);
        $amount = number_format($transaction->amount, 2);

        $data = [
            'name' => $user->name,
            'email' => $user->email,
            'subject' => "Coin Mining Stock - {$transactionType} Transaction Notification",
            'body' => "Dear {$user->name},\n\nA new {$transaction->type} transaction has been recorded on your account.\n\n" .
                    "Transaction Details:\n" .
                    "Type: {$transactionType}\n" .
                    "Amount: ${$amount}\n" .
                    "Status: {$transaction->status}\n" .
                    "Date: " . $transaction->created_at->format('Y-m-d H:i:s') . "\n\n" .
                    "If you did not authorize this transaction, please contact our support team immediately.\n\n" .
                    "Best regards,\nCoin Mining Stock"
        ];

        Mail::send([], [], function ($message) use ($data) {
            $message->to($data['email'])
                ->subject($data['subject'])
                ->setBody($data['body'], 'text/plain');
        });

        Log::info('Transaction notification email sent to: ' . $user->email);
    }
}
