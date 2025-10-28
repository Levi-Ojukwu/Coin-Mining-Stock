<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Coin Mining Stock Notification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; background:#fff; padding:20px; border-radius:8px;">
        <h2 style="color:#2d3748;">Hello {{ $sentMail['name'] ?? 'User' }},</h2>
        <p>{{ $sentMail['body'] ?? 'This is a test email from Coin Mining Stock.' }}</p>
        <p style="margin-top:30px;">Best regards,<br><strong>Coin Mining Stock Team</strong></p>
    </div>
</body>
</html>
