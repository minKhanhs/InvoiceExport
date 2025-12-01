import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Button } from '../../components/ui/Button';
import {
  FileText,
  Zap,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Đa dạng mẫu hóa đơn',
    description: 'Bán lẻ, bán buôn, dịch vụ – tất cả trong một nền tảng thống nhất.',
  },
  {
    icon: Zap,
    title: 'Xử lý tức thì',
    description: 'Tự động tính toán, cảnh báo sai lệch và xuất PDF trong vài giây.',
  },
  {
    icon: ShieldCheck,
    title: 'Bảo mật chuẩn ngân hàng',
    description: 'Chuẩn hóa quyền truy cập, mã hóa dữ liệu và sao lưu liên tục.',
  },
  {
    icon: TrendingUp,
    title: 'Báo cáo thông minh',
    description: 'Biểu đồ trực quan, so sánh theo ngày/tháng giúp bạn quyết định nhanh.',
  },
];

const highlights = [
  'Thiết kế tối ưu cho đội kế toán và vận hành',
  'Tích hợp dễ dàng với hệ thống hiện có',
  'Hỗ trợ 24/7 cùng đội ngũ chuyên gia Invoice Pro',
];

export const LandingPage = () => {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-white" />
                Hệ sinh thái quản lý hóa đơn thế hệ mới
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Invoice Pro – Giữ dòng tiền minh bạch, tự động và chuẩn xác.
              </h1>
              <p className="text-lg text-rose-100">
                Từ nhập liệu, xuất file PDF đến phân tích doanh thu – tất cả được điều phối trên một
                dashboard duy nhất với trải nghiệm tuyệt vời.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="sm:w-auto w-full">
                  <Button size="lg" variant="primary" className="w-full">
                    Bắt đầu với Invoice Pro
                  </Button>
                </Link>
                <a href="#features" className="sm:w-auto w-full">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full border-white/40 text-pink-300 hover:text-pink-600 hover:bg-white"
                  >
                    Tìm hiểu thêm
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap gap-8 text-sm">
                <div>
                  <p className="text-3xl font-bold">5.3K+</p>
                  <p className="text-rose-100">Hóa đơn xử lý mỗi ngày</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">120+</p>
                  <p className="text-rose-100">Doanh nghiệp tin dùng</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">99.9%</p>
                  <p className="text-rose-100">Thời gian hoạt động</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-pink-400/40 border border-white/20 space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-rose-100">Invoice Pro</p>
              <h3 className="text-2xl font-semibold">Tự động hóa quy trình hóa đơn</h3>
              <ul className="space-y-4 text-rose-50">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                Truy cập Dashboard
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold tracking-[0.3em] text-pink-500 uppercase">Tính năng</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-3">Mọi công cụ bạn cần trong một nơi</h2>
          <p className="text-gray-600 mt-4">
            Invoice Pro kết hợp tự động hóa và trực quan hóa để giúp đội ngũ kế toán xử lý công việc
            chuẩn xác hơn bao giờ hết.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-pink-100 border border-pink-50 hover:-translate-y-1 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Learn more */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-10 shadow-xl shadow-pink-100 border border-pink-50">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-500 font-semibold">
              Tìm hiểu thêm
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              Dashboard trực quan, linh hoạt cho mọi vai trò.
            </h3>
            <p className="text-gray-600">
              Từ dashboard tổng quan đến danh sách chi tiết và biểu đồ thống kê – mọi thành viên đều
              có góc nhìn phù hợp để ra quyết định. Bạn chỉ cần đăng nhập và chọn module phù hợp.
            </p>
            <Link to="/dashboard">
              <Button variant="primary" className="mt-4">
                Đi tới Dashboard
              </Button>
            </Link>
          </div>
          <div className="bg-pink-50 rounded-2xl p-6 space-y-4 border border-pink-100">
            {[
              'Theo dõi dòng tiền realtime',
              'Tạo và xuất PDF chỉ với 2 bước',
              'Kiểm soát quyền truy cập từng phòng ban',
              'Biểu đồ doanh thu theo ngày/tháng',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-pink-500" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="bg-gradient-to-br from-white to-pink-50 rounded-3xl p-10 border border-pink-100 shadow-lg shadow-pink-100 grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-500 font-semibold">
              Liên hệ
            </p>
            <h3 className="text-3xl font-bold text-gray-800 mt-3">Kết nối cùng Invoice Pro</h3>
            <p className="text-gray-600 mt-4">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng đồng hành để triển khai hệ thống phù hợp với
              quy trình doanh nghiệp của bạn.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hotline</p>
                  <p className="font-semibold text-gray-800">1900 999 888</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">hello@invoicepro.vn</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-inner border border-pink-50">
            <p className="text-sm text-gray-500 mb-3">Gửi thông điệp cho chúng tôi</p>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
              />
              <textarea
                rows="4"
                placeholder="Nội dung liên hệ"
                className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"
              />
              <Button type="button" variant="primary" className="w-full">
                Gửi yêu cầu
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-pink-100 border border-pink-50 px-6 sm:px-10 py-12 text-center">
          <h3 className="text-3xl font-bold text-gray-800">Sẵn sàng chuẩn hóa quy trình?</h3>
          <p className="text-gray-600 mt-3 mb-6">
            Đăng nhập để trải nghiệm toàn bộ dashboard của Invoice Pro và khám phá sức mạnh tự động
            hóa.
          </p>
          <Link to="/login">
            <Button size="lg" variant="primary">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

