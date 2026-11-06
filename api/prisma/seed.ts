// api/prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const genreNames = ["Fantasy", "Science Fiction", "Mystery", "Biography"];
  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.create({
        data: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      }),
    ),
  );

  const sampleBooks = [
    { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy" },
    { title: "Dune", author: "Frank Herbert", genre: "Science Fiction" },
    { title: "The Big Sleep", author: "Raymond Chandler", genre: "Mystery" },
    { title: "Educated", author: "Tara Westover", genre: "Biography" },
    // ...continue until you have 15+ books across the 4 genres
  ];

  for (const book of sampleBooks) {
    const genre = genres.find((g) => g.name === book.genre);
    if (!genre) {
      throw new Error(`Missing seeded genre: ${book.genre}`);
    }

    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        isbn: `978${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        description: `${book.title} by ${book.author}.`,
        totalCopies: 3,
        availableCopies: 3,
        genreId: genre.id,
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());