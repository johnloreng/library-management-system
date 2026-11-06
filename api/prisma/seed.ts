import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const genres = ['Fantasy', 'Mystery', 'Science Fiction', 'History'];

const books = [
  { isbn: '9780000000001', title: 'The Glass Orchard', author: 'M. Rowan', genre: 'Fantasy' },
  { isbn: '9780000000002', title: 'A Map of Embers', author: 'L. Vale', genre: 'Fantasy' },
  { isbn: '9780000000003', title: 'The Moonlit Archive', author: 'C. Wren', genre: 'Fantasy' },
  { isbn: '9780000000004', title: 'Crown of Quiet Stars', author: 'A. North', genre: 'Fantasy' },
  { isbn: '9780000000005', title: 'The Last Clue', author: 'J. Mercer', genre: 'Mystery' },
  { isbn: '9780000000006', title: 'Murder at Bellweather Pier', author: 'S. Finch', genre: 'Mystery' },
  { isbn: '9780000000007', title: 'The Unmarked Room', author: 'R. Quinn', genre: 'Mystery' },
  { isbn: '9780000000008', title: 'A Study in Blue Ash', author: 'P. Ellis', genre: 'Mystery' },
  { isbn: '9780000000009', title: 'Signal from Europa', author: 'D. Sol', genre: 'Science Fiction' },
  { isbn: '9780000000010', title: 'The Quiet Machine', author: 'N. Park', genre: 'Science Fiction' },
  { isbn: '9780000000011', title: 'Beyond the Red Current', author: 'T. Arden', genre: 'Science Fiction' },
  { isbn: '9780000000012', title: 'Tomorrow, Rewritten', author: 'E. Kade', genre: 'Science Fiction' },
  { isbn: '9780000000013', title: 'Letters from the Silk Road', author: 'H. Bennett', genre: 'History' },
  { isbn: '9780000000014', title: 'The Winter of 1848', author: 'I. Clarke', genre: 'History' },
  { isbn: '9780000000015', title: 'Cities of the Ancient Sea', author: 'F. Morgan', genre: 'History' },
  { isbn: '9780000000016', title: 'A Republic in Pieces', author: 'G. Ellis', genre: 'History' },
];

async function main() {
  const genreRecords = await Promise.all(
    genres.map((name) =>
      prisma.genre.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
  const genreIds = new Map(genreRecords.map(({ name, id }) => [name, id]));

  await prisma.book.createMany({
    data: books.map(({ genre, ...book }) => {
      const genreId = genreIds.get(genre);
      if (!genreId) {
        throw new Error(`Missing seeded genre: ${genre}`);
      }

      return { ...book, genreId };
    }),
    skipDuplicates: true,
  });

  console.log(`Seeded ${genreRecords.length} genres and ${books.length} catalog books.`);
}

main()
  .catch((error: unknown) => {
    console.error('Database seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
