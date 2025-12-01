import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
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
    description: 'Mẫu đơn giản cho bán lẻ',
    icon: ShoppingBag,
    color: 'blue',
  },
  {
    id: 'wholesale',
    name: 'Bán buôn',
    description: 'Cho doanh nghiệp',
    icon: Building2,
    color: 'green',
  },
  {
    id: 'service',
    name: 'Dịch vụ',
    description: 'Không cần vận chuyển',
    icon: Wrench,
    color: 'purple',
  },
];

export const CreateInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [step, setStep] = useState(isEditMode ? 2 : 1); // 1: Chọn template, 2: Nhập form
  const [templateType, setTemplateType] = useState('');
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_name: '',
    customer_address: '',
    date: formatDateInput(new Date()),
    items: [{ name: '', qty: 1, price: 0, amount: 0 }],
    meta: { note: '' },
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;
    const fetchInvoice = async () => {
      try {
        setInitializing(true);
        const data = await invoiceAPI.getInvoice(id);
        setTemplateType(data.template_type);
        const normalizedItems =
          data.items && data.items.length
            ? data.items
            : [{ name: '', qty: 1, price: 0, amount: 0 }];

        setFormData({
          invoice_number: data.invoice_number,
          customer_name: data.customer_name,
          customer_address: data.customer_address,
          date: formatDateInput(data.date),
          items: normalizedItems.map((item) => ({
            name: item.name || '',
            qty: Number(item.qty) || 1,
            price: Number(item.price) || 0,
            amount:
              item.amount !== undefined
                ? Number(item.amount)
                : (Number(item.qty) || 0) * (Number(item.price) || 0),
          })),
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
      // Tự động generate invoice number
      const invoiceNumber = `INV-${Date.now()}`;
      setFormData((prev) => ({ ...prev, invoice_number: invoiceNumber }));
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
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };

      // Tự động tính thành tiền
      if (field === 'qty' || field === 'price') {
        const qty = Number(newItems[index].qty) || 0;
        const price = Number(newItems[index].price) || 0;
        newItems[index].amount = qty * price;
      }

      return {
        ...prev,
        items: newItems,
      };
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

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!templateType) {
      alert('Vui lòng chọn loại hóa đơn');
      return;
    }

    if (!formData.customer_name || !formData.customer_address) {
      alert('Vui lòng điền đầy đủ thông tin khách hàng');
      return;
    }

    if (formData.items.some((item) => !item.name || item.amount <= 0)) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm và đảm bảo thành tiền > 0');
      return;
    }

    try {
      setLoading(true);
      const invoiceData = {
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

      if (isEditMode) {
        await invoiceAPI.updateInvoice(id, invoiceData);
        alert('Cập nhật hóa đơn thành công!');
      } else {
        await invoiceAPI.createInvoice(invoiceData);
        alert('Tạo hóa đơn thành công!');
      }
      navigate('/dashboard/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Có lỗi xảy ra khi lưu hóa đơn: ' + (error.response?.data?.message || error.message));
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
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Đang tải dữ liệu hóa đơn...
        </div>
      </DashboardLayout>
    );
  }

  // Step 1: Template Selection
  if (!isEditMode && step === 1) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Tạo hóa đơn mới</h1>
          <p className="text-gray-600">Chọn loại mẫu hóa đơn</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATE_TYPES.map((template) => {
              const Icon = template.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-300',
                green: 'bg-green-100 text-green-600 hover:bg-green-200 border-green-300',
                purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200 border-purple-300',
              };
              const iconColorClasses = {
                blue: 'text-blue-600',
                green: 'text-green-600',
                purple: 'text-purple-600',
              };

              return (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                    colorClasses[template.color]
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-8 text-center">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className={`w-10 h-10 ${iconColorClasses[template.color]}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                    <p className="text-sm opacity-80">{template.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Step 2: Form
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn'}
            </h1>
            <p className="text-gray-600 mt-1">
              Loại: {TEMPLATE_TYPES.find((t) => t.id === templateType)?.name || 'Chưa chọn'}
            </p>
          </div>
          <Button variant="outline" onClick={handleBackAction}>
            {isEditMode ? 'Quay về danh sách' : 'Quay lại'}
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
                  const isActive = templateType === template.id;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setTemplateType(template.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition shadow-sm ${
                        isActive
                          ? 'border-pink-400 bg-pink-50 text-pink-600'
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

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Mã hóa đơn"
                value={formData.invoice_number}
                readOnly
                className="bg-gray-50"
              />
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

          {/* Items Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh sách sản phẩm</CardTitle>
                <Button type="button" variant="primary" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Thêm dòng
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên hàng</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Đơn giá</TableHead>
                    <TableHead>Thành tiền</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          placeholder="Tên sản phẩm"
                          required
                          className="min-w-[200px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                          required
                          className="w-24"
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
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formData.items.length > 1 && (
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
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
                  <p className="text-sm text-gray-600 mb-1">Tổng cộng:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(calculateTotal())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Ghi chú (tùy chọn)"
                value={formData.meta.note}
                onChange={(e) =>
                  handleInputChange('meta', { ...formData.meta, note: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard/invoices')}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu hóa đơn'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

