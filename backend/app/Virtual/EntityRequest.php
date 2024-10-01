<?php

namespace App\Virtual;
/**
 * @OA\Schema(
 *      title="Entity request",
 *      description="Store entity request body data",
 *      type="object",
 *      required={"date","name","condition","deletable"}
 * )
 */

class EntityRequest
{
    /**
     * @OA\Property(
     *     title="ID",
     *     description="ID",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */
    private $id;

    /**
     * @OA\Property(
     *      title="date",
     *      description="Date of the new entity",
     *      example="2020-01-27 17:50:45"
     * )
     *
     * @var \DateTime
     */
    protected $date;

    /**
     * @OA\Property(
     *      title="Name",
     *      description="Name of the entity",
     *      example="This is new Name"
     * )
     *
     * @var string
     */
    protected $name;

    /**
     * @OA\Property(
     *     title="Condition",
     *     description="Entity condition on a scale from 1 to 10",
     *     format="int64",
     *     example=1
     * )
     *
     * @var integer
     */

    protected $condition;

    /**
     * @OA\Property(
     *     title="Deletable",
     *     description="Tiny int value depicting is the entity can be deleted ",
     *     format="int32",
     *     example=1
     * )
     *
     * @var integer
     */
    protected $deletable;
}
