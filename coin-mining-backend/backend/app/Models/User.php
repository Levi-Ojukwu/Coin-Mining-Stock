<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'country',
        'phone_number',
        'password',
        'role',
        'balance',
        'total_withdrawal',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'balance' => 'decimal:2',
            'total_withdrawal' => 'decimal:2',
        ];
    }

    // protected $casts = [
    //     'email_verified_at' => 'datetime',
    //     'password' => 'hashed',
    //     'balance' => 'decimal:2',
    //     'total_withdrawal' => 'decimal:2'
    // ];

    // Add the transactions relationship
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function getJWTIdentifier() {
        return $this->getkey();
    }

    public function getJWTCustomClaims() {
        return [
            'role' => $this->role,
            'type' => 'user'
        ];
    }

    // Add notifications relationship
    public function notifications()
    {
        return $this->hasMany(Notification::class)->orderBy('created_at', 'desc');
    }

    public function unreadNotifications()
    {
        return $this->hasMany(Notification::class)->where('is_read', false);
    }
}
