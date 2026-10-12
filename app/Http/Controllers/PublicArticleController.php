<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicArticleController extends Controller
{
    /**
     * Display the public articles catalog archive.
     * Supports keyword search across title, excerpt, and content.
     * Strictly restricts to published articles.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $articlesQuery = Article::query()
            ->published()
            ->with(['categories', 'tags'])
            ->latest('published_at');

        if (is_string($search) && trim($search) !== '') {
            $searchTerm = trim($search);
            $articlesQuery->where(function (Builder $query) use ($searchTerm) {
                $query->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('excerpt', 'like', "%{$searchTerm}%")
                    ->orWhere('content', 'like', "%{$searchTerm}%");
            });
        }

        $articles = $articlesQuery->get();

        $categories = Category::query()
            ->article()
            ->orderBy('name')
            ->get();

        return Inertia::render('articles', [
            'articles' => $articles,
            'categories' => $categories,
            'search' => is_string($search) && trim($search) !== '' ? trim($search) : null,
        ]);
    }

    /**
     * Display a single published article reader.
     * Draft articles strictly trigger a 404 response.
     */
    public function show(string $slug): Response
    {
        $article = Article::query()
            ->published()
            ->where('slug', $slug)
            ->with(['categories', 'tags'])
            ->firstOrFail();

        $relatedArticles = Article::query()
            ->published()
            ->where('id', '!=', $article->id)
            ->with(['categories', 'tags'])
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('articles/show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}
