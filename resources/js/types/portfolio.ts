export type ArticleStatus = 'draft' | 'published';
export type CategoryType = 'article' | 'project';

export interface Profile {
    id: number;
    name: string;
    headline?: string | null;
    about?: string | null;
    photo?: string | null;
    email: string;
    sosmed?: Record<string, string> | null;
    created_at?: string;
    updated_at?: string;
}

export interface Skill {
    id: number;
    name: string;
    category?: string | null;
    level?: string | number | null;
    icon?: string | null;
    is_featured: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Education {
    id: number;
    institution: string;
    degree: string;
    start_year: number;
    end_year?: number | null;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Experience {
    id: number;
    company: string;
    role: string;
    start_date: string;
    end_date?: string | null;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Certification {
    id: number;
    name: string;
    issuer: string;
    issued_at: string;
    image?: string | null;
    credential_url?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    type: CategoryType;
    created_at?: string;
    updated_at?: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    cover_image?: string | null;
    status: ArticleStatus;
    is_featured: boolean;
    published_at?: string | null;
    categories?: Category[];
    tags?: Tag[];
    created_at?: string;
    updated_at?: string;
}

export interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    tech_stack?: string[] | string | null;
    image?: string | null;
    project_url?: string | null;
    is_featured: boolean;
    categories?: Category[];
    created_at?: string;
    updated_at?: string;
}

export interface PortfolioHomeProps {
    profile: Profile;
    skills: Skill[];
    experiences: Experience[];
    educations: Education[];
    certifications: Certification[];
    featuredProjects: Project[];
    featuredArticles: Article[];
}
