<?php

namespace App\Http\Controllers;

use App\Models\AdminNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminNotificationController extends Controller
{
    public function getAdminNotifications()
    {
        try {
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            $notifications = AdminNotification::orderBy('created_at', 'desc')
                ->take(20)
                ->get();

            $unreadCount = AdminNotification::where('is_read', false)->count();

            return response()->json([
                'notifications' => $notifications,
                'unread_count' => $unreadCount
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch admin notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch notifications'], 500);
        }
    }

    public function markAsRead(Request $request, $notificationId)
    {
        try {
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            $notification = AdminNotification::find($notificationId);

            if (!$notification) {
                return response()->json(['error' => 'Notification not found'], 404);
            }

            $notification->markAsRead();

            return response()->json(['message' => 'Notification marked as read']);

        } catch (\Exception $e) {
            Log::error('Failed to mark admin notification as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark notification as read'], 500);
        }
    }

    public function markAllAsRead()
    {
        try {
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            AdminNotification::where('is_read', false)->update(['is_read' => true]);

            return response()->json(['message' => 'All notifications marked as read']);

        } catch (\Exception $e) {
            Log::error('Failed to mark all admin notifications as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark all notifications as read'], 500);
        }
    }
}
