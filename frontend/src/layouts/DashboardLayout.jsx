import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/dashboard/invoices/new', label: 'Tạo hóa đơn', icon: PlusCircle },
    { path: '/dashboard/invoices', label: 'Danh sách', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-20 px-6 border-b border-pink-100">
        <Link to="/" className="flex items-center gap-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400 font-semibold">Invoice</p>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-transparent bg-clip-text">
              Invoice Pro
            </h1>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-500 hover:text-pink-600 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 border-l-4 transition-all ${isActive(item.path)
                ? 'border-pink-600 bg-pink-50 text-pink-600 shadow-inner'
                : 'border-transparent text-gray-500 hover:bg-pink-50 hover:text-pink-600'
                }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive(item.path)
                  ? 'text-pink-600'
                  : 'text-gray-400 group-hover:text-pink-600'
                  }`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-6 border-t border-pink-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Xin chào,</p>
            <p className="font-semibold text-gray-800">Admin</p>
          </div>
        </div>
        <Button variant="secondary" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </Button>
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
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl shadow-pink-100 border-r border-pink-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {sidebarContent}
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-pink-100">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-2xl border border-pink-200 text-pink-600 w-10 h-10"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="ml-auto flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500">Trạng thái hệ thống</p>
                <p className="text-sm font-semibold text-gray-800">Hoạt động ổn định</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-pink-100 flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-pink-600" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

