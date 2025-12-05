# Frontend Structure & Routing

## Component Tree

```
App
├── Providers (Auth, Theme, Query)
├── Layout
│   ├── Navbar (Public)
│   └── Footer (Public)
├── Pages
│   ├── Home (/)
│   │   ├── Hero
│   │   ├── SkillsSection
│   │   ├── Timeline
│   │   ├── ProjectsGrid
│   │   ├── TestimonialsSection
│   │   ├── BlogSection
│   │   └── ContactSection
│   ├── Login (/login)
│   └── Dashboard (/dashboard)
│       ├── Layout (Sidebar)
│       ├── Overview (/dashboard)
│       ├── Projects (/dashboard/projects)
│       │   └── ProjectForm
│       ├── Timeline (/dashboard/timeline)
│       ├── Blogs (/dashboard/blogs)
│       ├── Testimonials (/dashboard/testimonials)
│       └── Users (/dashboard/users)
```

## Routing Map

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Main portfolio landing page |
| `/login` | Public | Admin login page |
| `/dashboard` | Protected (User) | Admin overview |
| `/dashboard/projects` | Protected (Admin) | Manage portfolio projects |
| `/dashboard/timeline` | Protected (Admin) | Manage experience/education |
| `/dashboard/blogs` | Protected (Admin) | Manage blog posts |
| `/dashboard/testimonials` | Protected (Admin) | Manage client reviews |
| `/dashboard/users` | Protected (Admin) | Manage system users |
