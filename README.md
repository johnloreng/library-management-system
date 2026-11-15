# Library Management System

## Database setup

The Prisma schema uses PostgreSQL. Copy `api/.env.example` to `api/.env` and set
`DATABASE_URL` to your PostgreSQL connection string. Then, from `api/`, install
dependencies, generate the Prisma Client, and apply the initial migration:

```sh
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

The seed creates four genres, sixteen books, and a default librarian user account (`librarian@library.com`). It can be run repeatedly without
duplicating those entries.

## Schema Decisions

`Book` references `Genre` through `genreId` and a Prisma relation instead of
embedding genre details in each book. A normalized relation avoids repeating
genre names, lets the database enforce that each book points to an existing
genre, and allows genre metadata to be updated consistently. The foreign key is
indexed for catalog queries and deletion of a genre with books is restricted.

The `User` role is an enum (`PATRON` or `LIBRARIAN`) so persisted roles are
limited to the supported values. Reviews are modeled as a separate relation to
both books and users; each user can leave at most one review per book.

One difference from a document database is that Prisma makes relationships
explicit in the schema and uses foreign keys to enforce referential integrity;
in a document database, related data is often embedded or linked by application
convention.

## API & Authentication

### Authentication Endpoints
- `POST /auth/register` — Register a new account (default role: `PATRON`). Issues access and refresh tokens.
- `POST /auth/login` — Login with email and password. Rate-limited to 5 attempts per minute via `@nestjs/throttler`. Issues access and refresh tokens.
- `POST /auth/refresh` — Refresh expired access token using a valid refresh token.
- `GET /auth/me` — Retrieve the currently authenticated user profile.

### Books & Genres (Full CRUD + Search & Filtering)
- `GET /books?search=tolkien&genreId=2` — Public catalog with case-insensitive search (across title, author, and ISBN) and genre filtering.
- `GET /books/:id` — Public single book details with nested genre and reviews.
- `POST /books` — **Librarian only** (`RolesGuard` + `Role.LIBRARIAN`). Creates a new book.
- `PATCH /books/:id` — **Librarian only**. Updates book details.
- `DELETE /books/:id` — **Librarian only**. Deletes book.
- `POST /books/:id/borrow` — Authenticated patron/librarian borrows a copy.
- `POST /books/:id/return` — Authenticated patron/librarian returns a copy.
- `GET /genres` — Public listing of genres with book counts.
- `GET /genres/:id` — Public single genre with its books.
- `POST /genres`, `PATCH /genres/:id`, `DELETE /genres/:id` — **Librarian only**.

### Stretch Features Implemented
1. **Refresh Tokens**: Implemented dual-token flow (`accessToken` expiring in 15m and `refreshToken` expiring in 7d) via `POST /auth/refresh`.
2. **Login Rate-Limiting**: Configured `@nestjs/throttler` to guard `POST /auth/login` (HTTP 429 Too Many Requests after threshold).

## Quick Syntax Reference (Cheat Sheet)

| Syntax | Purpose | Example in Project |
|---|---|---|
| `@Controller("path")` | Defines the base route for the class | `@Controller('books')` in [book.controller.ts](file:///Users/mac/Desktop/PROJECT/library-management-system/api/src/book/book.controller.ts#L17) |
| `@Get() @Post() @Patch() @Delete()` | HTTP verbs for handler methods | Full CRUD in [book.controller.ts](file:///Users/mac/Desktop/PROJECT/library-management-system/api/src/book/book.controller.ts) & [genre.controller.ts](file:///Users/mac/Desktop/PROJECT/library-management-system/api/src/genre/genre.controller.ts) |
| `@Param("id") @Query("q") @Body()` | Extracts parameters, queries, and request body | `@Query() query: BookQueryDto`, `@Body() dto: CreateBookDto` |
| `@Injectable()` | Registers class into NestJS Dependency Injection | Services & guards ([book.service.ts](file:///Users/mac/Desktop/PROJECT/library-management-system/api/src/book/book.service.ts#L5), [roles.guard.ts](file:///Users/mac/Desktop/PROJECT/library-management-system/api/src/auth/guards/roles.guard.ts#L6)) |
| `@UseGuards(GuardClass)` | Protects route with authentication / authorization guards | `@UseGuards(JwtAuthGuard, RolesGuard)` in [book.controller.ts](file:///Users/mac/Desktop/PROJECT/library-management-system/api/src/book/book.controller.ts#L38) |
| `@Roles("LIBRARIAN")` | Metadata decorator setting required role(s) | `@Roles(Role.LIBRARIAN)` on book mutation routes |
| `throw new NotFoundException(...)` | Built-in HTTP exception → 404 | Thrown in `book.service.ts` when an ID is not found |
| `throw new ConflictException(...)` | Built-in HTTP exception → 409 | Thrown in `auth.service.ts` when email is already registered |


