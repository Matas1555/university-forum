<?php

use L5Swagger\L5SwaggerServiceProvider;

return [
    App\Providers\AppServiceProvider::class,
    L5SwaggerServiceProvider::class,
    PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider::class
];
