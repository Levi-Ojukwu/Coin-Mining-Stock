<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

// use Illuminate\Support\Facade\Auth;
// use Illuminate\Support\Facade\Log;

class NotificationController extends Controller
{
     public function getUserNotifications()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $notifications = $user->notifications()
                ->orderBy('created_at', 'desc')
                ->take(20)
                ->get();

            $unreadCount = $user->unreadNotifications()->count();

            return response()->json([
                'notifications' => $notifications,
                'unread_count' => $unreadCount
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch user notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch notifications'], 500);
        }
    }

    public function markAsRead(Request $request, $notificationId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $notification = Notification::where('id', $notificationId)
                ->where('user_id', $user->id)
                ->first();

            if (!$notification) {
                return response()->json(['error' => 'Notification not found'], 404);
            }

            $notification->markAsRead();

            return response()->json(['message' => 'Notification marked as read']);

        } catch (\Exception $e) {
            Log::error('Failed to mark notification as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark notification as read'], 500);
        }
    }

    public function markAllAsRead()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $user->unreadNotifications()->update(['is_read' => true]);

            return response()->json(['message' => 'All notifications marked as read']);

        } catch (\Exception $e) {
            Log::error('Failed to mark all notifications as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark all notifications as read'], 500);
        }
    }
}
