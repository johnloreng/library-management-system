import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import { BookX, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';

export default function BookGrid({ genreId, search, sortBy = 'title', onResetFilters }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books from API on mount and whenever genreId or search changes
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const params = {};

    if (genreId) {
      params.genreId = genreId;
    }
    if (search && search.trim()) {
      params.search = search.trim();
    }

    axios.get(`${apiUrl}/books`, { params })
      .then((res) => {
        if (!isCancelled) {
          setBooks(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Error fetching books:', err);
          setError(
            err.response?.data?.message ||
              err.message ||
              'Unable to fetch books from server. Please check your backend connection.',
          );
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [genreId, search]);

  // Sort books (stretch feature)
  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === 'author') {
      return a.author.localeCompare(b.author);
    }
    if (sortBy === 'author-desc') {
      return b.author.localeCompare(a.author);
    }
    if (sortBy === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    // Default: title ascending
    return a.title.localeCompare(b.title);
  });

  // Skeleton Loading UI (Stretch feature)
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse flex flex-col"
            >
              <div className="h-44 bg-slate-200" />
              <div className="p-5 flex-1 flex flex-col space-y-3">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="space-y-2 pt-2 flex-1">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-4/5" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="h-3 bg-slate-200 rounded w-24" />
                  <div className="h-6 bg-slate-200 rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-xl mx-auto my-8 shadow-sm">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-rose-900 mb-2">Unable to Load Catalog</h3>
        <p className="text-sm text-rose-700 mb-6">{error}</p>
        <button
          type="button"
          onClick={() => {
            // Trigger refetch by re-assigning state
            setLoading(true);
            setError(null);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const params = {};
            if (genreId) params.genreId = genreId;
            if (search && search.trim()) params.search = search.trim();
            axios
              .get(`${apiUrl}/books`, { params })
              .then((res) => {
                setBooks(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
              })
              .catch((err) => {
                setError(err.message || 'Retry failed');
                setLoading(false);
              });
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  // Empty State
  if (sortedBooks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No Books Found</h3>
        <p className="text-sm text-slate-500 mb-6">
          {search
            ? `No matches found for "${search}". Try searching by another keyword, author, or clearing the genre filter.`
            : 'No books available for the selected genre filter.'}
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  // Success: Render responsive grid of BookCards
  return (
    <div>
      <div className="flex items-center justify-between mb-4 text-xs md:text-sm text-slate-500">
        <span>
          Showing <strong className="text-slate-800 font-semibold">{sortedBooks.length}</strong>{' '}
          {sortedBooks.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
