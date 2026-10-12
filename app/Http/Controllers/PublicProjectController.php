<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicProjectController extends Controller
{
    /**
     * Display the public projects catalog archive.
     * Supports optional category filtering by slug.
     */
    public function index(Request $request): Response
    {
        $selectedCategory = $request->query('category');

        $projectsQuery = Project::query()
            ->with('categories')
            ->latest();

        if (is_string($selectedCategory) && trim($selectedCategory) !== '') {
            $categorySlug = trim($selectedCategory);
            $projectsQuery->whereHas('categories', function (Builder $query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            });
        }

        $projects = $projectsQuery->get();

        $categories = Category::query()
            ->project()
            ->orderBy('name')
            ->get();

        return Inertia::render('projects', [
            'projects' => $projects,
            'categories' => $categories,
            'selectedCategory' => is_string($selectedCategory) && trim($selectedCategory) !== '' ? trim($selectedCategory) : null,
        ]);
    }

    /**
     * Display a single project detail page.
     */
    public function show(string $slug): Response
    {
        $project = Project::query()
            ->where('slug', $slug)
            ->with('categories')
            ->firstOrFail();

        $relatedProjects = Project::query()
            ->where('id', '!=', $project->id)
            ->with('categories')
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('projects/show', [
            'project' => $project,
            'relatedProjects' => $relatedProjects,
        ]);
    }
}
