import { Link } from 'react-router-dom';
import { BookOpen, User, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BookCard({ book }) {
  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Cover / Header banner */}
      <div className="relative h-44 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 flex items-center justify-center p-6 text-white overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center text-center space-y-2 z-10">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <BookOpen className="h-8 w-8 text-indigo-200" />
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-200/90 line-clamp-1 max-w-[200px]">
              {book.genre?.name || 'General'}
            </span>
          </div>
        )}

        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Status badge in upper right */}
        <div className="absolute top-3 right-3 z-20">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
              isAvailable
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {book.availableCopies} available
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                Checked out
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        {/* Genre tag */}
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600">
          <Tag className="w-3.5 h-3.5" />
          <span>{book.genre?.name || 'Uncategorized'}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
          <User className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-medium line-clamp-1">{book.author}</span>
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs md:text-sm text-slate-500 line-clamp-2 leading-relaxed flex-grow">
          {book.description || 'No description provided.'}
        </p>

        {/* Card Footer: ISBN and Link */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono text-[11px] text-slate-400">
            ISBN: {book.isbn}
          </span>
          <Link
            to={`/books/${book.id}`}
            className="inline-flex items-center justify-center px-3.5 py-1.5 font-semibold text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-150"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
