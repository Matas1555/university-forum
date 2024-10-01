<?php
namespace App\Virtual\Models;
/**
 * @OA\Schema(
 *      title="Store User request",
 *      description="Store Project request body data",
 *      type="object",
 *
 * )
 */

/**
 * @OA\Schema(
 *     title="User",
 *     description="User model",
 *     @OA\Xml(
 *         name="User"
 *     )
 * )
 */
class User
{
    /**
     * @OA\Property(
     *      title="username",
     *      description="username of the user",
     *      example=" default test user = a"
     * )
     *
     * @var string
     */
    protected $username;

    /**
     * @OA\Property(
     *      title="password",
     *      description="passsword of the user",
     *      example="default test password = b"
     * )
     *
     * @var string
     */
    protected $password;
}
