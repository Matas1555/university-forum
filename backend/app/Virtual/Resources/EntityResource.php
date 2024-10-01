<?php
namespace App\Virtual\Resources;
use App\Virtual\Models\Entity;

/**
 * @OA\Schema(
 *     title="DataResource",
 *     description="Entity resource",
 *     @OA\Xml(
 *         name="EntityResource"
 *     )
 * )
 */
class EntityResource
{
    /**
     * @OA\Property(
     *     title="Data",
     *     description="Data wrapper"
     * )
     *
     * @var Entity[]
     */
    private $data;
}
