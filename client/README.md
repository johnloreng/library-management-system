# Library Management System - Frontend Client

A responsive React + Vite application for patron-facing library catalog browsing, debounced live searching, genre filtering, and full book details.

## Features

- **Catalog Listing**: Responsive grid of `BookCard` components displaying availability badges, cover art/icons, authors, and genres.
- **Book Details Page**: Deep-dive view at `/books/:id` fetching complete book information, synopsis, and patron reviews.
- **Genre Filtering**: Dynamic filter buttons synced to backend `/genres` to view books by specific category.
- **Debounced Search**: `SearchBar` with real-time debounced queries (350ms with timeout cleanup) across titles and authors.
- **Graceful States**: Polished loading skeletons, error screens with retry buttons, and helpful empty search states.
- **Stretch Features**:
  - **Sort Control**: Client-side sorting by Title (A-Z, Z-A) or Author (A-Z, Z-A).
  - **Skeleton UI**: Clean shimmer placeholder cards while data is loading.

## Getting Started

1. Ensure the NestJS backend is running at `http://localhost:3000`.
2. Install dependencies:
   ```bash
   cd client
   npm install
   ```
3. Verify `client/.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```
