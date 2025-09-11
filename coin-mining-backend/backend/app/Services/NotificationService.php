<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public static function createBalanceUpdateNotification(User $user, $originalBalance, $originalWithdrawal)
    {
        try {
            $balanceChange = $user->balance - $originalBalance;
            $withdrawalChange = $user->total_withdrawal - $originalWithdrawal;

            // Determine notification type and message
            if ($balanceChange > 0) {
                $type = 'deposit';
                $title = 'Deposit Confirmed';
                $message = "Your account has been credited with $" . number_format($balanceChange, 2);
            } elseif ($balanceChange < 0) {
                $type = 'withdrawal';
                $title = 'Withdrawal Processed';
                $message = "A withdrawal of $" . number_format(abs($balanceChange), 2) . " has been processed from your account";
            } else {
                $type = 'balance_update';
                $title = 'Account Updated';
                $message = 'Your account information has been updated by an administrator';
            }

            // Create the notification
            Notification::create([
                'user_id' => $user->id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'data' => [
                    'previous_balance' => $originalBalance,
                    'new_balance' => $user->balance,
                    'previous_withdrawal' => $originalWithdrawal,
                    'new_withdrawal' => $user->total_withdrawal,
                    'balance_change' => $balanceChange,
                    'withdrawal_change' => $withdrawalChange
                ],
                'is_read' => false
            ]);

            Log::info('Balance update notification created for user: ' . $user->email);

        } catch (\Exception $e) {
            Log::error('Failed to create balance update notification: ' . $e->getMessage());
        }
    }

    public static function createTransactionNotification(User $user, $transaction)
    {
        try {
            $title = ucfirst($transaction->type) . ' Transaction';
            $message = "A " . $transaction->type . " of $" . number_format($transaction->amount, 2) . " has been recorded on your account";

            Notification::create([
                'user_id' => $user->id,
                'type' => 'transaction',
                'title' => $title,
                'message' => $message,
                'data' => [
                    'transaction_id' => $transaction->id,
                    'transaction_type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'status' => $transaction->status
                ],
                'is_read' => false
            ]);

            Log::info('Transaction notification created for user: ' . $user->email);

        } catch (\Exception $e) {
            Log::error('Failed to create transaction notification: ' . $e->getMessage());
        }
    }
}
