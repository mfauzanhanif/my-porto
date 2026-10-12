<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public portfolio landing page.
     *
     * Adheres strictly to the PortfolioHomeProps contract:
     * - profile: Profile
     * - skills: Skill[]
     * - experiences: Experience[]
     * - educations: Education[]
     * - certifications: Certification[]
     * - featuredProjects: Project[] (max 3, with categories)
     * - featuredArticles: Article[] (status published, max 3, with categories and tags)
     */
    public function index(Request $request): Response
    {
        $profile = Profile::query()->first() ?? new Profile([
            'name' => 'M FAUZAN HANIF',
            'headline' => 'Full-Stack Software Engineer | Laravel, React & Cloud Enthusiast',
            'about' => 'Passionate software engineer specializing in building high-performance web applications and maintainable systems.',
            'email' => 'fauzanhanif2112@gmail.com',
            'photo' => null,
            'sosmed' => [
                'github' => 'https://github.com/fauzanhanif',
                'linkedin' => 'https://linkedin.com/in/fauzanhanif',
                'email' => 'mailto:fauzanhanif2112@gmail.com',
            ],
        ]);

        $skills = Skill::query()
            ->orderBy('category')
            ->orderBy('name')
            ->get();

        $experiences = Experience::query()
            ->chronological()
            ->get();

        $educations = Education::query()
            ->chronological()
            ->get();

        $certifications = Certification::query()
            ->chronological()
            ->get();

        $featuredProjects = Project::query()
            ->featured()
            ->with('categories')
            ->latest()
            ->take(3)
            ->get();

        $featuredArticles = Article::query()
            ->published()
            ->featured()
            ->with(['categories', 'tags'])
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('welcome', [
            'profile' => $profile,
            'skills' => $skills,
            'experiences' => $experiences,
            'educations' => $educations,
            'certifications' => $certifications,
            'featuredProjects' => $featuredProjects,
            'featuredArticles' => $featuredArticles,
        ]);
    }
}
