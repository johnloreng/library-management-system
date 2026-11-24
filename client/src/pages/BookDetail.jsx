import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  BookOpen,
  User,
  Tag,
  Hash,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch GET /books/:id on mount or when id changes
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    axios.get(`${apiUrl}/books/${id}`)
      .then((res) => {
        if (!isCancelled) {
          setBook(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error(`Failed to fetch book #${id}:`, err);
          setError(
            err.response?.status === 404
              ? `Book #${id} could not be found in our catalog.`
              : err.response?.data?.message || err.message || 'Error loading book details.',
          );
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Skeleton Loading UI (Stretch feature)
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 h-72 bg-slate-200 rounded-2xl" />
            <div className="flex-1 space-y-4">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-3/4 bg-slate-200 rounded" />
              <div className="h-5 w-1/2 bg-slate-200 rounded" />
              <div className="h-10 w-40 bg-slate-200 rounded-xl" />
              <div className="space-y-2 pt-4">
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-3 w-4/5 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !book) {
    return (
      <div className="max-w-lg mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Book Not Available</h2>
        <p className="text-sm text-slate-600 mb-6">{error || 'The requested book was not found.'}</p>
        <div className="flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const reviews = Array.isArray(book.reviews) ? book.reviews : [];
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>

      {/* Main Book Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Cover image or decorative graphic */}
          <div className="md:w-5/12 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-8 flex flex-col items-center justify-center relative overflow-hidden text-white min-h-[300px]">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="max-h-80 w-auto object-contain rounded-xl shadow-2xl z-10"
              />
            ) : (
              <div className="flex flex-col items-center text-center space-y-4 z-10 p-6">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
                  <BookOpen className="h-16 w-16 text-indigo-200" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest font-bold text-indigo-300">
                    {book.genre?.name || 'Catalog Item'}
                  </span>
                  <p className="text-xs text-indigo-200/70">ISBN: {book.isbn}</p>
                </div>
              </div>
            )}

            {/* Background ambient blurs */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Book Information */}
          <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Genre badge & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                  <Tag className="w-3.5 h-3.5" />
                  {book.genre?.name || 'Uncategorized'}
                </span>

                {averageRating && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{averageRating} / 5</span>
                    <span className="text-slate-400">({reviews.length})</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {book.title}
              </h1>

              {/* Author */}
              <div className="flex items-center gap-2 text-base text-slate-700 font-medium">
                <User className="w-4 h-4 text-slate-400" />
                <span>By {book.author}</span>
              </div>

              {/* Availability Status Badge */}
              <div className="pt-2">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold ${
                    isAvailable
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {isAvailable ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>
                        Available to Borrow ({book.availableCopies} of {book.totalCopies} copies in library)
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Currently Checked Out (0 of {book.totalCopies} copies available)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="pt-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Synopsis & Overview
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {book.description || 'No description provided for this catalog entry.'}
                </p>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">ISBN</span>
                  <span className="font-mono text-slate-700">{book.isbn}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">Added on</span>
                  <span className="text-slate-700">
                    {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'Catalog Seed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patron Reviews Section */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Patron Reviews ({reviews.length})</h2>
          </div>
          {averageRating && (
            <div className="text-sm text-slate-500">
              Average Rating: <strong className="text-slate-800">{averageRating}</strong> out of 5
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <p>No patron reviews submitted for this book yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-800">
                    {review.user?.email || 'Patron'}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                )}
                <div className="text-[11px] text-slate-400">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
