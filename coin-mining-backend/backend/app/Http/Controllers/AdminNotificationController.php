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
                return response()->json(['message' => 'Unauthorized access'], 403);
            }

            $notifications = AdminNotification::orderBy('created_at', 'desc')
                ->take(4)
                ->get();

            $unreadCount = AdminNotification::where('is_read', false)->count();

            return response()->json([
                'success' => true,
                'message' => 'Admin notifications fetched successfully',
                'data' => [
                    'notifications' => $notifications,
                    'unread_count' => $unreadCount
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch admin notifications: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notifications'
            ], 500);
        }
    }

    public function markAsRead($id)
    {
        try {
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized access'], 403);
            }

            $notification = AdminNotification::find($id);

            if (!$notification) {
                return response()->json(['message' => 'Notification not found'], 404);
            }

            $notification->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read',
                'data' => $notification
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to mark admin notification as read: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read'
            ], 500);
        }
    }

    public function markAllAsRead()
    {
        try {
            $admin = JWTAuth::parseToken()->authenticate();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized access'], 403);
            }

            // Mark all unread notification as read 
            AdminNotification::where('is_read', false)->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read successfully'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to mark all admin notifications as read: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read'
            ], 500);
        }
    }

    public function recent()
    {
        $notifications = AdminNotification::latest()->take(5)->get();
        return response()->json($notifications);
    }
}
