<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EntityRequest;
use App\Models\Entity;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class EntityController extends Controller
{
    // authentification should be implemented in lab4, recommended library https://laravel-jwt-auth.readthedocs.io/
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * @OA\Get(
     *      path="/entity/list",
     *      operationId="getEntityList",
     *      tags={"Entities"},
     *      summary="Get list of entities",
     *      description="Returns list of entities",
     *      security={{ "apiAuth": {} }},
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/EntityResource")
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *     )
     */

    public function index()
    {
        return response()->json(
            Entity::all()->toArray()
        );
        // More laravel way of writing return are displayed below the above is adapted to React App created with .Net as backend in mind
        // return EntityResource::collection(Entity::all());
        // You should also think about the performance impact of all() method, maybe pagination would be required to speed up the performance?
    }
    /**
     * @OA\Post(
     *      path="/entity/create",
     *      operationId="storeEntity",
     *      tags={"Entities"},
     *      summary="Store new Entity",
     *      description="Returns entity data",
     *      security={{ "apiAuth": {} }},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/EntityRequest")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Entity")
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     * )
     */
    public function store(EntityRequest $request)
    {
        $entities = Entity::create($request->validated());

        return response()->json([
            'status' => 'success',
            'entities' => $entities,
        ]);
    }

    /**
     * @OA\Get(
     *      path="/entity/load",
     *      operationId="getEntityById",
     *      tags={"Entities"},
     *      summary="Get entity information",
     *      description="Returns entity data",
     *      security={{ "apiAuth": {} }},
     *      @OA\Parameter(
     *          name="id",
     *          description="Entity id",
     *          required=true,
     *          in="query",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Entity")
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     * )
     */

    public function show(Request $request)
    {
        $id = $request->query('id');
        try{
            $entity = Entity::findOrFail($id);
            return response()->json($entity);
        } catch(ModelNotFoundException $e){
            return abort(500, 'entity not found');
        }
    }
    /**
     * @OA\Post (
     *      path="/entity/update",
     *      operationId="updateEntity",
     *      tags={"Entities"},
     *      summary="Update existing entity",
     *      description="Returns updated entity data",
     *      security={{ "apiAuth": {} }},
     *      @OA\Parameter(
     *          name="id",
     *          description="Entity id",
     *          required=true,
     *          in="query",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/EntityRequest")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Entity")
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Resource Not Found"
     *      )
     * )
     */


    public function update(EntityRequest $request)
    {
        $id = $request->id;
        try {
            $entity = Entity::findOrFail($id);
            $entity->update($request->validated());
            return response()->json([
                'status' => 'success'
            ]);
        }
        catch(ModelNotFoundException $e){
            return abort(500, 'entity not found');
        }
    }

    /**
     * @OA\Get(
     *      path="/entity/delete",
     *      operationId="deleteEntity",
     *      tags={"Entities"},
     *      summary="Delete existing entity",
     *      description="Deletes a record and returns no content",
     *      security={{ "apiAuth": {} }},
     *      @OA\Parameter(
     *          name="id",
     *          description="Entity id",
     *          required=true,
     *          in="query",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent()
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Resource Not Found"
     *      )
     * )
     */

    public function destroy(Request $request)
    {
        $id = $request->query('id');
        try {
            $entities = Entity::findOrFail($id);

            $entities->delete();

            return response()->json([
                'status' => 'success',
            ]);
        } catch(ModelNotFoundException $e){
            return abort(500, 'entity not found');
        }

    }
}
