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

The seed creates four genres and sixteen books. It can be run repeatedly without
duplicating those catalog entries.

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
