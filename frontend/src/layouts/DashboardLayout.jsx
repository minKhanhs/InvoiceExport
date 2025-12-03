import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Menu,
  X,
  Receipt,
  Edit3,
} from 'lucide-react';
import { WelcomeModal } from '../components/ui/WelcomeModal';

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  useEffect(() => {
    const stored =
      localStorage.getItem('userName') || localStorage.getItem('displayName') || '';
    if (stored) {
      setUserName(stored);
      localStorage.setItem('userName', stored);
    } else {
      setWelcomeOpen(true);
    }
  }, []);

  const handleSaveName = (name) => {
    localStorage.setItem('userName', name);
    localStorage.setItem('displayName', name);
    setUserName(name);
    setWelcomeOpen(false);
  };

  const userInitial = userName.trim().charAt(0).toUpperCase() || 'I';

  const menuItems = [
    { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/dashboard/invoices/new', label: 'Tạo hóa đơn', icon: PlusCircle },
    { path: '/dashboard/invoices', label: 'Danh sách hóa đơn', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  const content = children ?? <Outlet />;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 via-rose-50 to-white">
      <div className="flex items-center justify-between h-20 px-6 border-b border-pink-100/70">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-400 flex items-center justify-center shadow-lg shadow-pink-400/40 group-hover:shadow-pink-500/60 transition-shadow">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 text-transparent bg-clip-text">
              InvoicePro
            </h1>
            <p className="text-xs text-pink-700/70 font-medium">Desktop App</p>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-pink-500 hover:text-pink-700 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 border-l-4 transition-all ${active
                ? 'bg-pink-100/80 text-pink-700 border-pink-600 shadow-md shadow-pink-200'
                : 'border-transparent text-slate-600 hover:bg-pink-50 hover:text-pink-700'
                }`}
            >
              <Icon
                className={`w-5 h-5 ${active ? 'text-pink-600' : 'text-slate-400 group-hover:text-pink-600'
                  }`}
              />
              <span className="font-medium text-sm">{item.label}</span>
              {active && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-pink-500/80" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-slate-200/60">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
          <p className="text-xs font-semibold text-pink-700 mb-1">Phiên bản</p>
          <p className="text-sm font-bold text-pink-900">1.0.0</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-pink-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white/90 backdrop-blur-xl shadow-xl shadow-pink-200/60 border-r border-pink-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {sidebarContent}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm shadow-pink-100/60">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-xl border border-pink-100 text-pink-500 hover:bg-pink-50 w-10 h-10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="ml-auto flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-semibold border-2 border-pink-200 shadow-sm">
                  {userInitial}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-pink-700 leading-tight">
                    Xin chào, {userName || 'bạn'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setWelcomeOpen(true)}
                    className="inline-flex items-center gap-1 text-xs text-pink-500 hover:text-pink-700 font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Đổi tên</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{content}</main>
      </div>

      <WelcomeModal
        isOpen={welcomeOpen}
        initialName={userName}
        onSubmit={handleSaveName}
      />
    </div>
  );
};

