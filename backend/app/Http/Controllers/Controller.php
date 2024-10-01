<?php

namespace App\Http\Controllers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Laravel OpenApi Documentation",
 *      description="L5 Swagger OpenApi",
 *      @OA\Contact(
 *          email="admin@admin.com"
 *      ),
 *      @OA\License(
 *          name="Apache 2.0",
 *          url="http://www.apache.org/licenses/LICENSE-2.0.html"
 *      )
 * )
 *
 * @OA\Server(
 *      url=L5_SWAGGER_CONST_HOST,
 *      description="API Server"
 * )
 *
 *
 *
 * @OA\Tag(
 *     name="Entities",
 *     description="API Endpoints of Entities"
 * )
 *
 * @OA\Tag(
 *      name="Authentication",
 *      description="API Endpoint for Login"
 *  )
 *
 * @OA\SecurityScheme(
 *      type="http",
 *      description="Login with email and password to get the authentication token",
 *      name="Token based Based",
 *      in="header",
 *      scheme="bearer",
 *      bearerFormat="JWT",
 *      securityScheme="apiAuth",
 *  )
 *
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
