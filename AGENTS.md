# AGENTS.md

## Project Overview

This repository is a React + Spring Boot full-stack admin portfolio project.

- `frontend/`: React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Query
- `backend/`: Spring Boot 3.x, Java 17, Gradle, MyBatis, MariaDB
- Frontend calls the backend through Axios using the `/api` prefix.
- Backend exposes REST controllers under `/api/**`.

## Repository Layout

```text
.
├── frontend/
│   ├── src/api/          # Axios client and domain API modules
│   ├── src/components/   # Layout, auth guards, reusable UI components
│   ├── src/pages/        # Feature pages
│   ├── src/routes/       # React Router configuration
│   └── src/store/        # Redux store and slices
└── backend/
    ├── src/main/java/com/portfolio/backend/
    │   ├── config/       # Spring Security, CORS, MVC/static file config
    │   ├── controller/   # REST API controllers
    │   ├── service/      # Business logic
    │   ├── mapper/       # MyBatis mapper interfaces
    │   ├── dto/          # Request/response DTOs
    │   └── vo/           # DB-mapped value objects
    └── src/main/resources/
        ├── mapper/       # MyBatis XML SQL mappings
        └── application*.yml
```

## Development Commands

Run frontend commands from `frontend/`.

```bash
npm run dev
npm run build
npm run lint
```

Run backend commands from `backend/`.

```bash
./gradlew bootRun
./gradlew test
./gradlew build
```

## Local Runtime Assumptions

- Frontend dev server: `http://localhost:5173`
- Backend server: `http://localhost:8088`
- Local MariaDB database: `portfolio`
- Backend local profile expects `DB_USERNAME` and `DB_PASSWORD`, with local defaults in `application-local.yml`.
- Uploaded product images are served from `/images/**`.

## Architecture Notes

- Frontend authentication state is stored in Redux and persisted to `localStorage`.
- Axios request/response interceptors are centralized in `frontend/src/api/client.ts`.
- Route-level access control is implemented with `ProtectedRoute` and `AdminRoute`.
- Backend currently has Spring Security configured, but all requests are permitted by `SecurityConfig`.
- MyBatis maps Java mapper interfaces to XML files under `backend/src/main/resources/mapper`.
- Product create/update uses `multipart/form-data` for optional image upload.

## Coding Guidelines

- Preserve the existing feature-based structure.
- Keep frontend API calls inside `frontend/src/api`.
- Keep backend endpoint logic thin in controllers and put business rules in services.
- Add or update MyBatis XML only with the corresponding mapper interface changes.
- Do not change generated dependency files unless the dependency graph intentionally changes.
- Do not replace the current routing, state management, or persistence approach without a clear reason.

## Verification

For frontend changes, prefer:

```bash
npm run lint
npm run build
```

For backend changes, prefer:

```bash
./gradlew test
./gradlew build
```

If database-dependent behavior is changed, verify against a local MariaDB instance or document that DB verification was not run.
