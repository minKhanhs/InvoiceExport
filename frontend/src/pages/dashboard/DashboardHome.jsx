import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { invoiceAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, TrendingUp } from 'lucide-react';

export const DashboardHome = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalInvoices: 0,
    averageInvoice: 0,
  });
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

      const parsedData = data.map((item) => ({
        date: item.day,
        label: new Date(item.day).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        count: Number(item.count),
        total: Number(item.total),
      }));

      const totalRevenue = parsedData.reduce((sum, item) => sum + item.total, 0);
      const totalInvoices = parsedData.reduce((sum, item) => sum + item.count, 0);
      const averageInvoice = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

      setStats(parsedData);
      setSummary({
        totalRevenue,
        totalInvoices,
        averageInvoice,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
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
        case 'month': {
          return new Date(now.getFullYear(), now.getMonth(), 1);
        }
        case 'prevMonth': {
          return new Date(now.getFullYear(), now.getMonth() - 1, 1);
        }
        case 'year': {
          return new Date(now.getFullYear(), 0, 1);
        }
        default:
          return null;
      }
    })();

    const endDate = (() => {
      switch (selectedPeriod) {
        case 'prevMonth':
          return new Date(now.getFullYear(), now.getMonth(), 0);
        default:
          return now;
      }
    })();

    return stats.filter((item) => {
      const itemDate = new Date(item.date);
      if (!startDate) return true;
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [stats, selectedPeriod]);

  const chartData = filteredStats.length ? filteredStats : stats;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-2xl shadow-xl px-4 py-3 border border-pink-100">
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          <p className="text-lg font-bold text-pink-600 mt-1">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </DashboardLayout>
    );
  }

  const summaryCards = [
    {
      title: 'Doanh thu tháng này',
      value: formatCurrency(summary.totalRevenue),
      icon: DollarSign,
      accent: 'from-pink-500 to-rose-600',
      description: 'Cập nhật theo thời gian thực',
    },
    {
      title: 'Số hóa đơn',
      value: summary.totalInvoices,
      icon: FileText,
      accent: 'from-purple-500 to-pink-500',
      description: 'Tổng số đơn đã phát hành',
    },
    {
      title: 'Trung bình mỗi đơn',
      value: formatCurrency(summary.averageInvoice),
      icon: TrendingUp,
      accent: 'from-orange-400 to-pink-500',
      description: 'Giá trị trung bình hóa đơn',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-500/10 via-rose-100 to-pink-50 rounded-3xl p-6 border border-pink-100">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-500 font-semibold mb-3">
            Bảng điều khiển
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Xin chào, <span className="text-pink-600">Admin!</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Theo dõi hiệu suất kinh doanh theo thời gian thực với trải nghiệm thanh lịch của Invoice Pro.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                          <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                        </div>
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg shadow-pink-200`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{card.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {/* Chart */}
        <Card className="shadow-xl rounded-3xl">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-[0.3em]">
                  Phân tích
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">Thống kê doanh thu</h3>
              </div>
              <div className="flex flex-col gap-3 items-stretch">
                <div className="flex items-center gap-2 bg-pink-50 rounded-full p-1">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedPeriod(option.value);
                        setCustomRange({ start: '', end: '' });
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedPeriod === option.value && !customRange.start
                          ? 'bg-white text-pink-600 shadow'
                          : 'text-gray-500 hover:text-pink-600'
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
                    onChange={(e) =>
                      setCustomRange((prev) => ({ ...prev, start: e.target.value }))
                    }
                    className="px-3 py-2 rounded-xl border border-pink-100 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm bg-white"
                  />
                  <span className="text-gray-400 text-sm">đến</span>
                  <input
                    type="date"
                    value={customRange.end}
                    onChange={(e) =>
                      setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="px-3 py-2 rounded-xl border border-pink-100 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-sm bg-white"
                  />
                  {(customRange.start || customRange.end) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomRange({ start: '', end: '' });
                        setSelectedPeriod('7d');
                      }}
                      className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                    >
                      Xóa lọc
                    </button>
                  )}
                </div>
              </div>
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={420}>
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#fce7f3" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fde2e4" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#f472b6', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
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
                    stroke="#db2777"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    activeDot={{ r: 6, fill: '#db2777', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Chưa có dữ liệu thống kê
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

