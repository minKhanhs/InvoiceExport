import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', type: 'route' },
  { label: 'Tìm hiểu thêm', href: '#features', type: 'anchor' },
  { label: 'Liên hệ', href: '#contact', type: 'anchor' },
];

export const PublicLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderLink = (link, className = '') => {
    if (link.type === 'route') {
      return (
        <Link key={link.label} to={link.href} className={className}>
          {link.label}
        </Link>
      );
    }
    return (
      <a key={link.label} href={link.href} className={className}>
        {link.label}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                Invoice Pro
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
              {navLinks.map((link) =>
                renderLink(
                  link,
                  'hover:text-pink-600 transition-colors'
                )
              )}
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:block">
                <Button variant="secondary" size="sm">
                  <LogIn className="w-4 h-4 mr-2 inline" />
                  Đăng nhập
                </Button>
              </Link>
              <button
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-2xl border border-pink-200 text-pink-600"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-pink-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 text-sm font-semibold text-gray-600">
              {navLinks.map((link) =>
                renderLink(
                  link,
                  'py-2 rounded-xl px-3 hover:bg-pink-50'
                )
              )}
              <Link to="/login" className="py-2">
                <Button variant="secondary" className="w-full">
                  Đăng nhập
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Invoice Pro. Hệ thống quản lý hóa đơn thông minh.
        </div>
      </footer>
    </div>
  );
};

