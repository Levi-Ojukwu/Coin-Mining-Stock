<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $sentMail['subject'] ?? 'Coin Mining Stock Notification' }}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px 20px;
            color: #333;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .message {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .details {
            background-color: #f9f9f9;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #333;
        }
        .detail-value {
            color: #666;
            text-align: right;
        }
        .footer-message {
            font-size: 13px;
            color: #999;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            line-height: 1.6;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .cta-button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 30px;
            border-radius: 4px;
            text-decoration: none;
            margin: 20px 0;
            font-weight: 600;
        }
        .cta-button:hover {
            background-color: #764ba2;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>{{ config('app.name', 'Coin Mining Stock') }}</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello {{ $sentMail['name'] ?? 'User' }},
            </div>

            <div class="message">
                {{ $sentMail['body'] ?? 'This is a notification from Coin Mining Stock.' }}
            </div>

            <!-- Details Section -->
            @if(isset($sentMail['details']) && is_array($sentMail['details']))
            <div class="details">
                @foreach($sentMail['details'] as $label => $value)
                <div class="detail-row">
                    <span class="detail-label">{{ $label }}:</span>
                    <span class="detail-value">{{ $value }}</span>
                </div>
                @endforeach
            </div>
            @endif

            <!-- Additional Message -->
            @if(isset($sentMail['message']))
            <div class="message">
                {{ $sentMail['message'] }}
            </div>
            @endif

            <!-- Footer Message -->
            @if(isset($sentMail['footer']))
            <div class="footer-message">
                {{ $sentMail['footer'] }}
            </div>
            @endif
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name', 'Coin Mining Stock') }}. All rights reserved.</p>
            <p>
                <a href="mailto:support@coinminigstock.com">Contact Support</a> | 
                <a href="#">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>     