<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Forum;
use App\Models\Post;
use App\Models\Profile;
use App\Models\Program;
use App\Models\Status;
use App\Models\University;
use App\Models\User;
use App\Policies\CategoryPolicy;
use App\Policies\CommentPolicy;
use App\Policies\ForumPolicy;
use App\Policies\PostPolicy;
use App\Policies\ProfilePolicy;
use App\Policies\ProgramPolicy;
use App\Policies\StatusPolicy;
use App\Policies\UniversityPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Post::class => PostPolicy::class,
        Comment::class => CommentPolicy::class,
        Category::class => CategoryPolicy::class,
        Profile::class => ProfilePolicy::class,
        Forum::class => ForumPolicy::class,
        University::class => UniversityPolicy::class,
        Program::class => ProgramPolicy::class,
        User::class => UserPolicy::class,
        Status::class => StatusPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Register any additional services required by the application
    }
}
