<?php

namespace App\Services;

use App\Models\AdminNotification;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AdminNotificationService
{
    public static function createUserRegistrationNotification(User $user)
    {
        try {
            AdminNotification::create([
                'type' => 'user_registration',
                'title' => 'New User Registration',
                'message' => "A new user '{$user->name}' has registered on the platform",
                'data' => [
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'registration_time' => now()->toDateTimeString()
                ],
                'is_read' => false
            ]);

            Log::info('Admin notification created for user registration: ' . $user->email);

        } catch (\Exception $e) {
            Log::error('Failed to create admin notification for user registration: ' . $e->getMessage());
        }
    }

    public static function createUserLoginNotification(User $user)
    {
        try {
            AdminNotification::create([
                'type' => 'user_login',
                'title' => 'User Login',
                'message' => "User '{$user->name}' has logged into their dashboard",
                'data' => [
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'login_time' => now()->toDateTimeString()
                ],
                'is_read' => false
            ]);

            Log::info('Admin notification created for user login: ' . $user->email);

        } catch (\Exception $e) {
            Log::error('Failed to create admin notification for user login: ' . $e->getMessage());
        }
    }
}
