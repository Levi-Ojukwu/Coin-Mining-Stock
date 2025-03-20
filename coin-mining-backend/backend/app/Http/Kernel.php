protected $routeMiddleware = [
    // ... other middleware
    'check.role' => \App\Http\Middleware\CheckRole::class,
    \Fruitcake\Cors\HandleCors::class,
    'auth:admin-api' => \Tymon\JWTAuth\Http\Middleware\Authenticate::class,
];

