import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LogIn, ShieldCheck, Zap, Smartphone } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic giả lập: Lưu token và chuyển hướng
    localStorage.setItem('token', 'demo');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 opacity-90" />
      <div className="absolute -top-40 -right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-10 w-80 h-80 bg-rose-400/40 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur">
              <Smartphone className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide uppercase">Invoice Pro</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Quản lý hóa đơn cùng <span className="text-rose-200">Invoice Pro</span>
            </h1>
            <p className="text-lg text-rose-100">
              Trải nghiệm giao diện fintech hiện đại, bảo mật cao và xử lý siêu tốc cho mọi nghiệp vụ.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, text: 'Bảo mật tuyệt đối' },
                { icon: Zap, text: 'Xử lý trong tích tắc' },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 backdrop-blur"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-medium">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-pink-300 p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-pink-300 mb-4">
                <LogIn className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Đăng nhập hệ thống</h2>
              <p className="text-gray-500 mt-2">Nhập thông tin để truy cập bảng điều khiển</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                Đăng nhập
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Nhập bất kỳ email và mật khẩu nào để đăng nhập
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

