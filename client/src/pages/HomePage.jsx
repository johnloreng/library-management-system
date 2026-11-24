import { useState, useEffect } from 'react';
import axios from 'axios';
import BookGrid from '../components/BookGrid';
import SearchBar from '../components/SearchBar';
import { BookOpen, Layers, ArrowUpDown, Filter, XCircle } from 'lucide-react';

export default function HomePage() {
  // Shared filter and sorting state
  const [selectedGenreId, setSelectedGenreId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');

  // Genres fetched from backend
  const [genres, setGenres] = useState([]);

  // Fetch genres from GET /genres
  useEffect(() => {
    let isCancelled = false;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    axios.get(`${apiUrl}/genres`)
      .then((res) => {
        if (!isCancelled) {
          setGenres(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Failed to load genres:', err);
          setGenres([]);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleResetFilters = () => {
    setSelectedGenreId('');
    setSearchQuery('');
    setSortBy('title');
  };

  const selectedGenreObj = genres.find((g) => String(g.id) === String(selectedGenreId));

  return (
    <div className="space-y-8">
      {/* Hero / Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-100">
            <BookOpen className="w-4 h-4" />
            <span>Library Management System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Your Next Favorite Book
          </h1>
          <p className="text-indigo-100 text-sm md:text-base leading-relaxed max-w-2xl">
            Browse our curated collection of fiction, science fiction, biographies, and mysteries.
            Search live across titles or authors, or filter by genre.
          </p>

          {/* Search bar inside hero */}
          <div className="pt-2 max-w-2xl">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Controls Bar: Genre Filter, Stretch Sort Control, Active Filters */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Genre Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
              <Layers className="w-4 h-4 text-indigo-500" />
              Genres:
            </span>

            {/* "All" genre button */}
            <button
              type="button"
              onClick={() => setSelectedGenreId('')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                selectedGenreId === ''
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Genres
            </button>

            {/* Mapped genre buttons */}
            {genres.map((genre) => {
              const isSelected = String(selectedGenreId) === String(genre.id);
              return (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => setSelectedGenreId(isSelected ? '' : String(genre.id))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {genre.name}
                  {genre._count?.books !== undefined && (
                    <span
                      className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-indigo-500/50 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {genre._count.books}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Stretch Feature: Sort Control (by title or author) */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort books"
              className="bg-slate-100 border-none text-slate-700 text-xs sm:text-sm font-medium rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="title">Title (A &rarr; Z)</option>
              <option value="title-desc">Title (Z &rarr; A)</option>
              <option value="author">Author (A &rarr; Z)</option>
              <option value="author-desc">Author (Z &rarr; A)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar (when filters are active) */}
        {(selectedGenreId !== '' || searchQuery.trim() !== '') && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Active filters:
            </span>

            {selectedGenreObj && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                Genre: {selectedGenreObj.name}
                <button
                  type="button"
                  onClick={() => setSelectedGenreId('')}
                  className="hover:text-indigo-900"
                  aria-label="Remove genre filter"
                >
                  &times;
                </button>
              </span>
            )}

            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-medium">
                Search: &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-amber-900"
                  aria-label="Clear search query"
                >
                  &times;
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium ml-auto"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reset all
            </button>
          </div>
        )}
      </section>

      {/* Book Grid displaying books based on shared filter state */}
      <section>
        <BookGrid
          genreId={selectedGenreId}
          search={searchQuery}
          sortBy={sortBy}
          onResetFilters={handleResetFilters}
        />
      </section>
    </div>
  );
}
