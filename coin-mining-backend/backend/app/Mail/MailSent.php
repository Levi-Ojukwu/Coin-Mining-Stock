<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MailSent extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    protected $sentMail;
    public $tries = 3;
    public $backoff = [60, 120, 300]; // Retry after 1min, 2min, 5min

    public function __construct($sentMail)
    {
        $this->sentMail = $sentMail;
        $this->onQueue('emails');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                env('MAIL_FROM_ADDRESS', 'ojukwulevichinedu@gmail.com'),
                env('MAIL_FROM_NAME', 'Coin Mining Stock')
            ),
            subject: $this->sentMail['subject'] ?? 'Coin Mining Stock Notification',
            replyTo: [new Address('support@coinminigstock.com', 'Support Team')]
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.mail_sent',
            with: ['sentMail' => $this->sentMail],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
