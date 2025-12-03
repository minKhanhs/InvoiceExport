import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LogIn, ShieldCheck, Zap, Smartphone } from 'lucide-react';

export const LoginPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = displayName.trim();
    if (!trimmedName) {
      return;
    }

    // Logic giả lập: Lưu token, tên hiển thị và chuyển hướng
    localStorage.setItem('token', 'demo');
    localStorage.setItem('displayName', trimmedName);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_24px_80px_rgba(244,114,182,0.35)] border border-pink-100 overflow-hidden">
        <div className="grid lg:grid-cols-[3fr_2fr]">
          {/* Cột trái - banner gradient */}
          <div className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white px-8 py-10 lg:px-10 lg:py-14">
            <div className="absolute -top-16 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-rose-400/40 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 rounded-full backdrop-blur border border-white/30">
                <Smartphone className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                  InvoicePro Desktop
                </span>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Quản lý hóa đơn
                  <br />
                  <span className="text-rose-100">Nhẹ nhàng & Hiệu quả</span>
                </h1>
                <p className="text-base lg:text-lg text-rose-100/90 max-w-md">
                  Tập trung vào công việc của bạn, để InvoicePro tự động hóa những phần còn lại:
                  xuất hóa đơn, theo dõi thanh toán và báo cáo doanh thu.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, text: 'Bảo mật chuẩn doanh nghiệp' },
                  { icon: Zap, text: 'Xử lý số liệu trong tích tắc' },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.text}
                      className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 backdrop-blur border border-white/20"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="font-medium">{feature.text}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-rose-100/80">
                “Một hệ thống đơn giản, để bạn tập trung phát triển doanh nghiệp.”
              </p>
            </div>
          </div>

          {/* Cột phải - form đăng nhập */}
          <div className="bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-pink-300 mb-4">
                <LogIn className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Chào mừng bạn trở lại 👋</h2>
              <p className="text-gray-500 mt-2 max-w-xs">
                Nhập thông tin bên dưới để bắt đầu quản lý hóa đơn với InvoicePro.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="text"
                label="Tên hiển thị của bạn"
                placeholder="Ví dụ: Linh Nguyễn"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <Input
                type="email"
                label="Email"
                placeholder="example@invoicepro.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Mật khẩu"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className="w-full" size="lg">
                Vào hệ thống
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Bạn có thể nhập bất kỳ email và mật khẩu nào để trải nghiệm demo.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
