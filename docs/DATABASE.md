# Database

## Table Schema

| Nama Tabel | Kolom Utama | Keterangan / Relasi |
| :--- | :--- | :--- |
| profiles | id, name, bio, about_text, email, github_url, linkedin_url, resume_url, hero_image | single-row untuk profil utama & kontak. |
| skills | id, name, icon (SVG/class), level (enum/int), is_featured (boolean) | is_featured untuk memfilter data di landing page. |
| educations | id, institution, degree, start_date, end_date, description | Bisa diurutkan berdasarkan end_date DESC. |
| experiences | id, company, position, start_date, end_date, is_current, description | is_current (boolean) jika masih bekerja di sana. |
| certifications | id, title, issuer, issue_date, credential_url, image | |
| tags | id, name, slug | Khusus untuk Articles. |
| categories | id, name, slug, type (enum: 'article', 'project') | Master table untuk pengelompokan. |
| articles | id, title, slug, excerpt, content, cover_image, is_featured, published_at | is_featured untuk ditarik ke Home Page. |
| projects | id, title, slug, description, repository_url, live_url, image, is_featured | |
| article_tag (Pivot) | article_id, tag_id | Menghubungkan Articles dan Tags. |
| article_category (Pivot) | article_id, category_id | Validasi di backend: pastikan category_id memiliki type = 'article'. |
| project_category (Pivot) | project_id, category_id | Validasi di backend: pastikan category_id memiliki type = 'project'. |

## Diagram ER

```mermaid
erDiagram
    profiles {
        bigint id PK
        string name
        text bio
        text about_text
        string email
        string github_url
        string linkedin_url
        string resume_url
        string hero_image
    }

    skills {
        bigint id PK
        string name
        string icon
        enum level
        boolean is_featured
    }

    educations {
        bigint id PK
        string institution
        string degree
        date start_date
        date end_date
        text description
    }

    experiences {
        bigint id PK
        string company
        string position
        date start_date
        date end_date
        boolean is_current
        text description
    }

    certifications {
        bigint id PK
        string title
        string issuer
        date issue_date
        string credential_url
        string image
    }

    tags {
        bigint id PK
        string name
        string slug
    }

    categories {
        bigint id PK
        string name
        string slug
        enum type "article | project"
    }

    articles {
        bigint id PK
        string title
        string slug
        text excerpt
        text content
        string cover_image
        boolean is_featured
        datetime published_at
    }

    projects {
        bigint id PK
        string title
        string slug
        text description
        string repository_url
        string live_url
        string image
        boolean is_featured
    }

    article_tag {
        bigint article_id FK
        bigint tag_id FK
    }

    article_category {
        bigint article_id FK
        bigint category_id FK
    }

    project_category {
        bigint project_id FK
        bigint category_id FK
    }

    articles ||--o{ article_tag : "has"
    tags ||--o{ article_tag : "has"

    articles ||--o{ article_category : "has"
    categories ||--o{ article_category : "has"

    projects ||--o{ project_category : "has"
    categories ||--o{ project_category : "has"
```
