protected $routeMiddleware = [
    // ... other middleware
    'check.role' => \App\Http\Middleware\CheckRole::class,
    \Fruitcake\Cors\HandleCors::class,
];

