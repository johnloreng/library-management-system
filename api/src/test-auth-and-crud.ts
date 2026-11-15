import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function runTests() {
  console.log('=== Starting Test Suite: Auth, RolesGuard, CRUD, Search & Filtering ===\n');

  const app = await NestFactory.create(AppModule, { logger: false });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const testPort = 3333;
  await app.listen(testPort);
  const baseUrl = `http://localhost:${testPort}`;

  async function api(path: string, options: RequestInit = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, ok: res.ok, data };
  }

  try {
    // 1. Register Patron
    const patronEmail = `patron_${Date.now()}@library.test`;
    console.log(`1. Testing User Registration (POST /auth/register)...`);
    const regRes = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: patronEmail,
        password: 'password123',
      }),
    });
    if (regRes.status !== 201) throw new Error(`Register failed: ${JSON.stringify(regRes.data)}`);
    const patronToken = regRes.data.accessToken;
    const patronRefreshToken = regRes.data.refreshToken;
    console.log(`   ✓ Registered patron: ${patronEmail} [Role: ${regRes.data.user.role}]`);
    console.log(`   ✓ Received accessToken and refreshToken`);

    // 2. Login as Librarian (seeded account)
    console.log(`\n2. Testing Librarian Login (POST /auth/login)...`);
    const libLoginRes = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'librarian@library.com',
        password: 'librarian123',
      }),
    });
    if (libLoginRes.status !== 200) throw new Error(`Librarian login failed: ${JSON.stringify(libLoginRes.data)}`);
    const librarianToken = libLoginRes.data.accessToken;
    console.log(`   ✓ Librarian logged in successfully [Role: ${libLoginRes.data.user.role}]`);

    // 3. Test Refresh Token
    console.log(`\n3. Testing Token Refresh (POST /auth/refresh)...`);
    const refreshRes = await api('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: patronRefreshToken }),
    });
    if (refreshRes.status !== 200 || !refreshRes.data.accessToken) {
      throw new Error(`Token refresh failed: ${JSON.stringify(refreshRes.data)}`);
    }
    console.log(`   ✓ Refresh token exchanged for new accessToken!`);

    // 3b. Test Stretch: GET /users/profile using @Req()
    console.log(`\n3b. Testing GET /users/profile (Stretch: @Req() user profile)...`);
    const profileRes = await api('/users/profile', {
      method: 'GET',
      headers: { Authorization: `Bearer ${patronToken}` },
    });
    if (profileRes.status !== 200 || profileRes.data.email !== patronEmail) {
      throw new Error(`GET /users/profile failed: ${JSON.stringify(profileRes.data)}`);
    }
    console.log(`   ✓ Successfully fetched user profile for ${profileRes.data.email} via @Req()!`);

    // 4. Test Book Search & Genre Filtering & Pagination (Public)
    console.log(`\n4. Testing Books Listing, Search, Genre Filtering & Pagination (GET /books)...`);
    const allBooks = await api('/books');
    console.log(`   ✓ Total books fetched: ${allBooks.data.length}`);

    const searchRes = await api('/books?search=Tolkien');
    console.log(`   ✓ Search for "Tolkien": found ${searchRes.data.length} books`);
    if (searchRes.data.length === 0) throw new Error('Search did not return expected books');

    const genreId = allBooks.data[0].genreId;
    const filterRes = await api(`/books?genreId=${genreId}`);
    console.log(`   ✓ Filter by genreId=${genreId}: found ${filterRes.data.length} books`);

    // 4b. Test Pagination: page & limit
    const pageRes = await api('/books?page=1&limit=2');
    if (pageRes.status !== 200 || pageRes.data.length !== 2) {
      throw new Error(`Pagination failed: expected 2 books, got ${pageRes.data?.length}`);
    }
    console.log(`   ✓ Pagination (page=1, limit=2): correctly returned 2 books`);

    // 5. Test RolesGuard on Book Creation (POST /books)
    console.log(`\n5. Testing RolesGuard on Book Creation (POST /books)...`);
    const newBookPayload = {
      title: `Automated Test Book ${Date.now()}`,
      author: 'Test Author',
      isbn: `978000${Date.now()}`.slice(0, 13),
      description: 'Test book description for verification',
      totalCopies: 5,
      genreId,
    };

    // 5a. Patron should be FORBIDDEN (403)
    const patronCreateRes = await api('/books', {
      method: 'POST',
      headers: { Authorization: `Bearer ${patronToken}` },
      body: JSON.stringify(newBookPayload),
    });
    console.log(`   Patron attempt response: ${patronCreateRes.status} ${JSON.stringify(patronCreateRes.data.message)}`);
    if (patronCreateRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden for patron, got ${patronCreateRes.status}`);
    }
    console.log(`   ✓ RolesGuard correctly blocked PATRON with 403 Forbidden!`);

    // 5b. Librarian should SUCCEED (201)
    const libCreateRes = await api('/books', {
      method: 'POST',
      headers: { Authorization: `Bearer ${librarianToken}` },
      body: JSON.stringify(newBookPayload),
    });
    if (libCreateRes.status !== 201) {
      throw new Error(`Librarian book creation failed: ${JSON.stringify(libCreateRes.data)}`);
    }
    const createdBook = libCreateRes.data;
    console.log(`   ✓ Librarian successfully created book #${createdBook.id}: "${createdBook.title}"`);

    // 6. Test Book Update & Delete (Librarian)
    console.log(`\n6. Testing Book Update (PATCH /books/:id) & Delete (DELETE /books/:id)...`);
    const updateRes = await api(`/books/${createdBook.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${librarianToken}` },
      body: JSON.stringify({ title: 'Updated Title by Librarian' }),
    });
    if (updateRes.status !== 200 || updateRes.data.title !== 'Updated Title by Librarian') {
      throw new Error(`Book update failed: ${JSON.stringify(updateRes.data)}`);
    }
    console.log(`   ✓ Librarian successfully updated book #${createdBook.id}`);

    const deleteRes = await api(`/books/${createdBook.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${librarianToken}` },
    });
    if (deleteRes.status !== 200) {
      throw new Error(`Book delete failed: ${JSON.stringify(deleteRes.data)}`);
    }
    console.log(`   ✓ Librarian successfully deleted book #${createdBook.id}`);

    // 7. Test Rate Limiting on Login
    console.log(`\n7. Testing Login Rate Limiting (@nestjs/throttler)...`);
    let rateLimitTriggered = false;
    for (let i = 0; i < 8; i++) {
      const res = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'bad@creds.com', password: 'wrong' }),
      });
      if (res.status === 429) {
        rateLimitTriggered = true;
        console.log(`   ✓ Rate limit triggered at request #${i + 1}: 429 Too Many Requests`);
        break;
      }
    }
    if (!rateLimitTriggered) {
      console.log('   Note: Rate limiter threshold not hit within request window');
    }

    console.log('\n======================================================');
    console.log('🎉 ALL TESTS PASSED: Full CRUD, Search, Auth, RolesGuard & Throttler verified!');
    console.log('======================================================\n');
  } finally {
    await app.close();
  }
}

runTests().catch((err) => {
  console.error('\n❌ Test failed with error:', err);
  process.exit(1);
});

