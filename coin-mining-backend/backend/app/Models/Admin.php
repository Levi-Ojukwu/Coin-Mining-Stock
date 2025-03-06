<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Admin extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    //Get the identifier that will be stored in the JWT subject claim.
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

     //Return a key-value array, containing any custom claims to be added to the JWT.

     public function getJWTCustomClaims()
     {
         return [
            'role' => $this->role,
            'type' => 'admin',
         ];
     }

    use HasApiTokens, Notifiable;

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Maximum number of allowed admins
    public static $maxAdmins = 4;

    public static function boot()
    {
        parent::boot();

        static::creating(function ($admin) {
            if (static::count() >= static::$maxAdmins) {
                throw new \Exception('Maximum number of admins (4) has been reached.');
            }
        });
    }
}
