import { PrismaService } from "./prisma/prisma.service";
import { Role } from "@prisma/client";

async function testApp() {
  console.log("--- Testing PrismaService & Database Integration ---");
  const prisma = new PrismaService();

  // Test onModuleInit ($connect)
  await prisma.onModuleInit();
  console.log("✓ PrismaService connected successfully via onModuleInit().");

  // Query genres
  const genres = await prisma.genre.findMany({
    include: {
      _count: { select: { books: true } },
    },
  });
  console.log(`✓ Fetched ${genres.length} genres:`);
  for (const g of genres) {
    console.log(`  - ${g.name} (${g.slug}): ${g._count.books} books`);
  }

  // Query books
  const books = await prisma.book.findMany({
    include: { genre: true },
  });
  console.log(`✓ Fetched ${books.length} total books.`);

  // Test User creation with Role enum
  const testUser = await prisma.user.upsert({
    where: { email: "librarian@library.org" },
    update: { role: Role.LIBRARIAN },
    create: {
      email: "librarian@library.org",
      password: "secure_password_hash",
      role: Role.LIBRARIAN,
    },
  });
  console.log(`✓ Tested User model with Role enum: ${testUser.email} [Role: ${testUser.role}]`);

  const patronUser = await prisma.user.upsert({
    where: { email: "patron@library.org" },
    update: { role: Role.PATRON },
    create: {
      email: "patron@library.org",
      password: "secure_password_hash",
      role: Role.PATRON,
    },
  });
  console.log(`✓ Tested User model with Role enum: ${patronUser.email} [Role: ${patronUser.role}]`);

  // Test Review model relation
  const sampleBook = books[0];
  const review = await prisma.review.upsert({
    where: {
      bookId_userId: {
        bookId: sampleBook.id,
        userId: patronUser.id,
      },
    },
    update: {
      rating: 5,
      comment: "Incredible book! Highly recommended.",
    },
    create: {
      bookId: sampleBook.id,
      userId: patronUser.id,
      rating: 5,
      comment: "Incredible book! Highly recommended.",
    },
  });
  console.log(`✓ Tested Review relation: Rating ${review.rating}/5 on "${sampleBook.title}" by ${patronUser.email}`);

  // Query Book with reviews and genre
  const bookWithDetails = await prisma.book.findUnique({
    where: { id: sampleBook.id },
    include: {
      genre: true,
      reviews: { include: { user: true } },
    },
  });
  console.log(`✓ Queried Book with nested Genre and Reviews:`);
  console.log(`  Title: ${bookWithDetails?.title}`);
  console.log(`  Genre: ${bookWithDetails?.genre.name}`);
  console.log(`  Reviews count: ${bookWithDetails?.reviews.length}`);

  await prisma.$disconnect();
  console.log("--- All tests passed! ---");
}

testApp().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
