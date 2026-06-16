# MERN SaaS Portfolio Template

A commercial-ready, secure, and scalable MERN stack application designed as a sellable template.

## 🚀 Features

- **Monorepo Structure**: Separate backend and frontend for better scalability.
- **Secure Authentication**: OAuth2 + OIDC + PKCE with HTTP-only cookies.
- **Admin Dashboard**: Full CRUD capabilities with role-based access.
- **Storytelling Portfolio**: Animated, responsive, and SEO-optimized.
- **Image Handling**: Integrated with Cloudinary (Free Tier).

## 📦 Commercial & Resale Rights

This project is designed to be sold as a template or a final product.

- **White Label Ready**: All branding is isolated in configuration files.
- **MIT License**: You are free to modify, distribute, and sell this code.
- **No Proprietary Dependencies**: Uses only open-source libraries and free-tier services.

## 🛠 Setup & Deployment

### Local Development

1.  **Clone & Install**
    ```bash
    git clone <repo>
    cd backend && npm install
    cd ../frontend && npm install
    ```

2.  **Environment Variables**
    - Fill in `backend/.env.development` and `frontend/.env.local`.

3.  **Run**
    - Backend: `npm run dev` (Port 5000)
    - Frontend: `npm run dev` (Port 3000)

### Production Deployment

#### Backend (Render/Railway)
1.  Connect your repository to Render.
2.  Select `backend` as the root directory.
3.  Add environment variables from `.env.example`.
4.  Build Command: `npm install`
5.  Start Command: `npm start`

#### Frontend (Vercel)
1.  Connect your repository to Vercel.
2.  Select `frontend` as the root directory.
3.  Add `NEXT_PUBLIC_API_URL` environment variable.
4.  Deploy!

## 📚 Documentation

See [docs/architecture.md](docs/architecture.md) for system diagrams and architecture details.
See [backend/src/docs/swagger.yaml](backend/src/docs/swagger.yaml) for API specification.
