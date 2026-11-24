// App.jsx: Defines routes for '/' (HomePage) and '/books/:id' (BookDetail)
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetail from './pages/BookDetail';
import { BookOpen, Library } from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform duration-150 hover:scale-[1.01]"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                Library Management
              </span>
              <span className="ml-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                System
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Catalog
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Connected
            </span>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>&copy; {currentYear} Library Management System</span>
          </div>
          <div className="text-slate-400">
            Powered by Vite, React, Tailwind CSS &amp; NestJS API
          </div>
        </div>
      </footer>
    </div>
  );
}
