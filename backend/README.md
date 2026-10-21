# Nityanand Netflix Portfolio Backend (NestJS + MongoDB)

Production-ready NestJS REST API with MongoDB Atlas (Mongoose) and JWT Authentication.

## Features
- **MongoDB Atlas Integration**: Automated seeding of chapters, hero scenes, cards, and profile information.
- **JWT Admin Authentication**: Protected endpoints for managing portfolio content.
- **CORS enabled**: Syncs with Next.js frontend (`http://localhost:3000`).

## Endpoints

### Public
- `GET /api/portfolio` - Fetch the full portfolio data (owner & chapters).

### Admin Authentication
- `POST /api/auth/login` - Admin login. Body: `{ "username": "admin", "password": "..." }`. Returns `{ accessToken }`.
- `GET /api/auth/me` - Validates JWT Bearer token.

### Protected (Requires `Authorization: Bearer <token>`)
- `PUT /api/portfolio` - Update complete portfolio.
- `PUT /api/portfolio/profile` - Update profile & contact information.
- `PUT /api/portfolio/chapters` - Update chapters & project cards.
- `POST /api/portfolio/reset` - Reset data back to defaults in MongoDB.

## Running the Backend

```bash
cd backend
npm run start:dev
```
Server runs at `http://localhost:5000/api`.
