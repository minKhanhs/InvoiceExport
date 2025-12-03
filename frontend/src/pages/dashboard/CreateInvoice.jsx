import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { invoiceAPI } from '../../services/api';
import { formatCurrency, formatDateInput } from '../../utils/formatters';
import { Plus, Trash2, ShoppingBag, Building2, Wrench } from 'lucide-react';

const TEMPLATE_TYPES = [
  {
    id: 'retail',
    name: 'Bán lẻ',
    description: 'Phù hợp cửa hàng nhỏ / bán lẻ',
    icon: ShoppingBag,
    color: 'from-pink-200 to-rose-200 text-pink-700',
  },
  {
    id: 'wholesale',
    name: 'Bán buôn',
    description: 'Dành cho doanh nghiệp',
    icon: Building2,
    color: 'from-violet-200 to-pink-200 text-violet-700',
  },
  {
    id: 'service',
    name: 'Dịch vụ',
    description: 'Các gói dịch vụ chuyên nghiệp',
    icon: Wrench,
    color: 'from-rose-200 to-orange-100 text-rose-700',
  },
];

export const CreateInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [step, setStep] = useState(isEditMode ? 2 : 1);
  const [templateType, setTemplateType] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(isEditMode);
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_name: '',
    customer_address: '',
    date: formatDateInput(new Date()),
    items: [{ name: '', qty: 1, price: 0, amount: 0 }],
    meta: { note: '' },
  });

  useEffect(() => {
    if (!isEditMode) return;

    const fetchInvoice = async () => {
      try {
        setInitializing(true);
        const data = await invoiceAPI.getInvoice(id);
        setTemplateType(data.template_type);
        setFormData({
          invoice_number: data.invoice_number,
          customer_name: data.customer_name,
          customer_address: data.customer_address,
          date: formatDateInput(data.date),
          items: (data.items?.length ? data.items : [{ name: '', qty: 1, price: 0, amount: 0 }]).map(
            (item) => ({
              name: item.name || '',
              qty: Number(item.qty) || 1,
              price: Number(item.price) || 0,
              amount:
                item.amount !== undefined
                  ? Number(item.amount)
                  : (Number(item.qty) || 0) * (Number(item.price) || 0),
            })
          ),
          meta: data.meta || { note: '' },
        });
      } catch (error) {
        console.error('Error loading invoice:', error);
        alert('Không thể tải dữ liệu hóa đơn.');
        navigate('/dashboard/invoices');
      } finally {
        setInitializing(false);
        setStep(2);
      }
    };

    fetchInvoice();
  }, [id, isEditMode, navigate]);

  const handleTemplateSelect = (templateId) => {
    setTemplateType(templateId);
    if (!isEditMode) {
      setFormData((prev) => ({ ...prev, invoice_number: `INV-${Date.now()}` }));
      setStep(2);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };

      if (field === 'qty' || field === 'price') {
        const qty = Number(items[index].qty) || 0;
        const price = Number(items[index].price) || 0;
        items[index].amount = qty * price;
      }

      return { ...prev, items };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', qty: 1, price: 0, amount: 0 }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!templateType) {
      alert('Vui lòng chọn loại hóa đơn.');
      return;
    }

    if (!formData.customer_name || !formData.customer_address) {
      alert('Vui lòng nhập đầy đủ thông tin khách hàng.');
      return;
    }

    if (formData.items.some((item) => !item.name || Number(item.amount) <= 0)) {
      alert('Vui lòng nhập thông tin sản phẩm và đảm bảo thành tiền > 0.');
      return;
    }

    const payload = {
      invoice_number: formData.invoice_number,
      template_type: templateType,
      customer_name: formData.customer_name,
      customer_address: formData.customer_address,
      date: formData.date,
      items: formData.items.map((item) => ({
        name: item.name,
        qty: Number(item.qty),
        price: Number(item.price),
        amount: Number(item.amount),
      })),
      total: calculateTotal(),
      meta: formData.meta,
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await invoiceAPI.updateInvoice(id, payload);
        alert('Cập nhật hóa đơn thành công!');
      } else {
        await invoiceAPI.createInvoice(payload);
        alert('Tạo hóa đơn thành công!');
      }
      navigate('/dashboard/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Không thể lưu hóa đơn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackAction = () => {
    if (isEditMode) {
      navigate('/dashboard/invoices');
    } else {
      setStep(1);
    }
  };

  if (isEditMode && initializing) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Đang tải dữ liệu hóa đơn...
      </div>
    );
  }

  if (!isEditMode && step === 1) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-500 font-semibold">Bắt đầu</p>
          <h1 className="text-3xl font-bold text-gray-900">Chọn loại hóa đơn</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATE_TYPES.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template.id)}
                className={`rounded-2xl border border-pink-100 bg-gradient-to-br ${template.color} p-6 text-left shadow-lg shadow-pink-100 transition hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-pink-500">Mẫu</p>
                    <h3 className="text-xl font-bold text-gray-800">{template.name}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center text-pink-500">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">{template.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-500 font-semibold">
            {isEditMode ? 'Chỉnh sửa' : 'Tạo mới'}
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn'}
          </h1>
          <p className="text-gray-500">
            Loại: {TEMPLATE_TYPES.find((t) => t.id === templateType)?.name || 'Chưa chọn'}
          </p>
        </div>
        <Button variant="outline" onClick={handleBackAction}>
          {isEditMode ? 'Quay về danh sách' : 'Chọn mẫu khác'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isEditMode && (
          <Card>
            <CardHeader>
              <CardTitle>Loại hóa đơn</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {TEMPLATE_TYPES.map((template) => {
                const Icon = template.icon;
                const active = templateType === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setTemplateType(template.id)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-2 transition ${active
                        ? 'border-pink-400 bg-pink-50 text-pink-600 shadow-inner shadow-pink-200'
                        : 'border-gray-200 text-gray-600 hover:border-pink-200 hover:text-pink-600'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{template.name}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Mã hóa đơn" value={formData.invoice_number} readOnly className="bg-gray-50" />
            <Input
              label="Tên khách hàng *"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              required
            />
            <Input
              label="Địa chỉ *"
              value={formData.customer_address}
              onChange={(e) => handleInputChange('customer_address', e.target.value)}
              required
            />
            <Input
              type="date"
              label="Ngày *"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <Button type="button" variant="primary" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" /> Thêm dòng
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên hàng</TableHead>
                  <TableHead className="w-32">Số lượng</TableHead>
                  <TableHead className="w-40">Đơn giá</TableHead>
                  <TableHead className="w-48">Thành tiền</TableHead>
                  <TableHead className="w-24">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items.map((item, index) => (
                  <TableRow key={index} className="bg-white/60">
                    <TableCell>
                      <Input
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        placeholder="Tên sản phẩm"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-pink-700">{formatCurrency(item.amount)}</div>
                    </TableCell>
                    <TableCell>
                      {formData.items.length > 1 && (
                        <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500">Tổng cộng</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(calculateTotal())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ghi chú bổ sung</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              rows="3"
              value={formData.meta.note}
              onChange={(e) => handleInputChange('meta', { ...formData.meta, note: e.target.value })}
              className="w-full rounded-2xl border border-pink-100 px-4 py-3 text-sm shadow-inner focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="Nhập ghi chú (tuỳ chọn)..."
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/invoices')}>
            Huỷ
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu hóa đơn'}
          </Button>
        </div>
      </form>
    </div>
  );
};
