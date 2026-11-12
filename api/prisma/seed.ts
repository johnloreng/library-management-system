import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const genreNames = ["Fantasy", "Science Fiction", "Mystery", "Biography"];

  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.upsert({
        where: { name },
        update: { slug: name.toLowerCase().replace(/\s+/g, "-") },
        create: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        },
      }),
    ),
  );

  const sampleBooks = [
    // Fantasy (4 books)
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "9780547928227",
      genre: "Fantasy",
      description: "The classic fantasy adventure of Bilbo Baggins.",
    },
    {
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
      isbn: "9780547928210",
      genre: "Fantasy",
      description: "The epic journey to destroy the One Ring begins.",
    },
    {
      title: "A Game of Thrones",
      author: "George R.R. Martin",
      isbn: "9780553103540",
      genre: "Fantasy",
      description: "Noble houses navigate intrigue and war in Westeros.",
    },
    {
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      isbn: "9780756404741",
      genre: "Fantasy",
      description: "The tale of Kvothe, legendary wizard and musician.",
    },

    // Science Fiction (4 books)
    {
      title: "Dune",
      author: "Frank Herbert",
      isbn: "9780441172719",
      genre: "Science Fiction",
      description: "A saga of politics, ecology, and prophecy on the desert planet Arrakis.",
    },
    {
      title: "Neuromancer",
      author: "William Gibson",
      isbn: "9780441569595",
      genre: "Science Fiction",
      description: "The seminal cyberpunk classic of cyberspace hackers and AI.",
    },
    {
      title: "Snow Crash",
      author: "Neal Stephenson",
      isbn: "9780553380958",
      genre: "Science Fiction",
      description: "A fast-paced journey through virtual reality and ancient linguistics.",
    },
    {
      title: "Foundation",
      author: "Isaac Asimov",
      isbn: "9780553293357",
      genre: "Science Fiction",
      description: "Psychohistory and the galactic empire's inevitable fall and rebirth.",
    },

    // Mystery (4 books)
    {
      title: "The Big Sleep",
      author: "Raymond Chandler",
      isbn: "9780394758282",
      genre: "Mystery",
      description: "Hardboiled detective Philip Marlowe investigates blackmail and murder.",
    },
    {
      title: "And Then There Were None",
      author: "Agatha Christie",
      isbn: "9780062073488",
      genre: "Mystery",
      description: "Ten strangers are lured to an isolated island and accused of past crimes.",
    },
    {
      title: "The Hound of the Baskervilles",
      author: "Arthur Conan Doyle",
      isbn: "9780140437867",
      genre: "Mystery",
      description: "Sherlock Holmes and Dr. Watson investigate a ghostly hound on the moors.",
    },
    {
      title: "The Maltese Falcon",
      author: "Dashiell Hammett",
      isbn: "9780679722649",
      genre: "Mystery",
      description: "Private investigator Sam Spade is pulled into the hunt for a jewel-encrusted falcon.",
    },

    // Biography (4 books)
    {
      title: "Educated",
      author: "Tara Westover",
      isbn: "9780399590504",
      genre: "Biography",
      description: "A memoir about growing up isolated from society and striving for education.",
    },
    {
      title: "Steve Jobs",
      author: "Walter Isaacson",
      isbn: "9781451648539",
      genre: "Biography",
      description: "The definitive biography of Apple's visionary co-founder.",
    },
    {
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      isbn: "9780553296983",
      genre: "Biography",
      description: "The writings kept while hiding during the German occupation of the Netherlands.",
    },
    {
      title: "Becoming",
      author: "Michelle Obama",
      isbn: "9781524763138",
      genre: "Biography",
      description: "An intimate and powerful memoir by the former First Lady of the United States.",
    },
  ];

  for (const book of sampleBooks) {
    const genre = genres.find((g) => g.name === book.genre);
    if (!genre) {
      throw new Error(`Missing seeded genre: ${book.genre}`);
    }

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        author: book.author,
        description: book.description,
        totalCopies: 3,
        availableCopies: 3,
        genreId: genre.id,
      },
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        totalCopies: 3,
        availableCopies: 3,
        genreId: genre.id,
      },
    });
  }

  console.log(`Seeded ${genres.length} genres and ${sampleBooks.length} books successfully.`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
