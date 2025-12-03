import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { invoiceAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, TrendingUp, Sparkles } from 'lucide-react';

export const DashboardHome = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalInvoices: 0, averageInvoice: 0 });
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const periodOptions = [
    { value: '7d', label: '7 ngày qua' },
    { value: 'month', label: 'Tháng này' },
    { value: 'prevMonth', label: 'Tháng trước' },
    { value: 'year', label: 'Năm nay' },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await invoiceAPI.getStats();
      const parsed = data.map((item) => ({
        date: item.day,
        label: new Date(item.day).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        count: Number(item.count),
        total: Number(item.total),
      }));
      const totalRevenue = parsed.reduce((sum, item) => sum + item.total, 0);
      const totalInvoices = parsed.reduce((sum, item) => sum + item.count, 0);
      const averageInvoice = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
      setStats(parsed);
      setSummary({ totalRevenue, totalInvoices, averageInvoice });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStats = useMemo(() => {
    if (!stats.length) return [];
    if (customRange.start && customRange.end) {
      const startDate = new Date(customRange.start);
      const endDate = new Date(customRange.end);
      return stats.filter((item) => {
        const d = new Date(item.date);
        return d >= startDate && d <= endDate;
      });
    }

    const now = new Date();
    const startDate = (() => {
      switch (selectedPeriod) {
        case '7d': {
          const d = new Date(now);
          d.setDate(d.getDate() - 6);
          return d;
        }
        case 'month':
          return new Date(now.getFullYear(), now.getMonth(), 1);
        case 'prevMonth':
          return new Date(now.getFullYear(), now.getMonth() - 1, 1);
        case 'year':
          return new Date(now.getFullYear(), 0, 1);
        default:
          return null;
      }
    })();

    const endDate = selectedPeriod === 'prevMonth' ? new Date(now.getFullYear(), now.getMonth(), 0) : now;

    return stats.filter((item) => {
      if (!startDate) return true;
      const d = new Date(item.date);
      return d >= startDate && d <= endDate;
    });
  }, [stats, selectedPeriod, customRange]);

  const chartData = filteredStats.length ? filteredStats : stats;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-2xl border border-pink-100 bg-white px-4 py-3 shadow-lg">
        <p className="text-sm font-semibold text-pink-700">{label}</p>
        <p className="text-lg font-bold text-pink-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Chào buổi sáng';
    if (hour >= 12 && hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const displayName =
    localStorage.getItem('userName') || localStorage.getItem('displayName') || 'bạn';

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-pink-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'Doanh thu tháng này',
      value: formatCurrency(summary.totalRevenue),
      icon: DollarSign,
      description: 'Cập nhật theo thời gian thực',
    },
    {
      title: 'Số hóa đơn',
      value: summary.totalInvoices,
      icon: FileText,
      description: 'Tổng số hóa đơn đã phát hành',
    },
    {
      title: 'Trung bình mỗi đơn',
      value: formatCurrency(summary.averageInvoice),
      icon: TrendingUp,
      description: 'Giá trị trung bình',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 p-6 text-white shadow-xl shadow-pink-400/40 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Bảng điều khiển</p>
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            {getGreeting()},
            <span className="ml-2 underline decoration-white/50 decoration-wavy underline-offset-4">
              {displayName}!
            </span>
          </h1>
          <p className="text-sm text-white/90">
            Theo dõi dòng tiền, số lượng hóa đơn và các chỉ số quan trọng của bạn trong nháy mắt.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            <span className="font-medium">{getFormattedDate()}</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 text-center sm:items-end sm:text-right">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white">
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="text-xs text-white/80">
            “Mỗi hóa đơn gọn gàng hôm nay là một quyết định tự tin hơn cho ngày mai.”
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pink-500">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className="rounded-2xl bg-pink-50 p-3 text-pink-600">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-500">Phân tích</p>
              <h3 className="text-2xl font-bold text-gray-900">Thống kê doanh thu</h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-pink-50 p-1">
                {periodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedPeriod(option.value);
                      setCustomRange({ start: '', end: '' });
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${selectedPeriod === option.value && !customRange.start
                        ? 'bg-white text-pink-600 shadow'
                        : 'text-gray-600 hover:text-pink-600'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(e) => setCustomRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="rounded-xl border border-pink-100 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-100"
                />
                <span className="text-sm text-gray-400">đến</span>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) => setCustomRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="rounded-xl border border-pink-100 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-100"
                />
                {(customRange.start || customRange.end) && (
                  <button
                    type="button"
                    className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                    onClick={() => {
                      setCustomRange({ start: '', end: '' });
                      setSelectedPeriod('7d');
                    }}
                  >
                    Xoá lọc
                  </button>
                )}
              </div>
            </div>
          </div>

          {chartData.length ? (
            <ResponsiveContainer width="100%" height={420}>
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#fce7f3" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f9a8d4" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#fb7185', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fill: '#f472b6', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#ec4899"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 6, fill: '#ec4899', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500">
              Chưa có dữ liệu thống kê
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
