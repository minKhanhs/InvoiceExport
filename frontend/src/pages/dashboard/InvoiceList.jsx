import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import PdfPreviewModal from '../../components/ui/PdfPreviewModal';
import { invoiceAPI } from '../../services/api';
import { cn, formatCurrency, formatDate } from '../../utils/formatters';
import { Search, Eye, Trash2, PencilLine } from 'lucide-react';

export const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, invoiceId: null });
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    pdfUrl: '',
    isLoading: false,
  });
  const navigate = useNavigate();

  const getStatusInfo = (invoice) => {
    const rawStatus = (invoice.meta?.status || 'pending').toLowerCase();
    switch (rawStatus) {
      case 'paid':
        return { label: 'Đã thanh toán', className: 'bg-green-100 text-green-700' };
      default:
        return { label: 'Chờ xử lý', className: 'bg-orange-100 text-orange-700' };
    }
  };

  const ActionIcon = ({ icon: Icon, label, variant = 'primary', ...rest }) => (
    <button
      aria-label={label}
      title={label}
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
        variant === 'danger'
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
      )}
      {...rest}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  useEffect(() => {
    return () => {
      if (previewModal.pdfUrl) {
        URL.revokeObjectURL(previewModal.pdfUrl);
      }
    };
  }, [previewModal.pdfUrl]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async (search = '') => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (search) {
        params.search = search;
      }
      const data = await invoiceAPI.getInvoices(params);
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInvoices(searchTerm);
  };

  const handleDelete = async () => {
    if (!deleteModal.invoiceId) return;

    try {
      await invoiceAPI.deleteInvoice(deleteModal.invoiceId);
      setDeleteModal({ isOpen: false, invoiceId: null });
      fetchInvoices(searchTerm);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Có lỗi xảy ra khi xóa hóa đơn');
    }
  };

  const handlePreview = async (id) => {
    setPreviewModal((prev) => ({ ...prev, isOpen: true, isLoading: true, pdfUrl: '' }));
    try {
      const response = await fetch(invoiceAPI.getPDFUrl(id));
      if (!response.ok) {
        throw new Error('Không thể tải file PDF');
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setPreviewModal({ isOpen: true, pdfUrl: objectUrl, isLoading: false });
    } catch (error) {
      console.error('Error previewing PDF:', error);
      setPreviewModal({ isOpen: false, pdfUrl: '', isLoading: false });
      alert('Không thể xem trước PDF. Vui lòng thử lại.');
    }
  };

  const closePreviewModal = () => {
    if (previewModal.pdfUrl) {
      URL.revokeObjectURL(previewModal.pdfUrl);
    }
    setPreviewModal({ isOpen: false, pdfUrl: '', isLoading: false });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-500 font-semibold">
            Quản lý hóa đơn
          </p>
          <h1 className="text-3xl font-bold text-gray-800">Danh sách hóa đơn</h1>
          <p className="text-gray-600">
            Theo dõi, tìm kiếm và thao tác nhanh chóng với các hóa đơn của bạn.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="bg-white/90 backdrop-blur">
          <CardContent className="p-5">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="Tìm kiếm theo mã, khách hàng hoặc nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary" className="md:w-auto w-full">
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Hóa đơn ({invoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Đang tải...</div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Không có hóa đơn nào</div>
            ) : (
              <Table className="rounded-2xl overflow-hidden">
                <TableHeader>
                  <TableRow className="bg-pink-50/80">
                    <TableHead className="text-pink-900 font-semibold">Mã HĐ</TableHead>
                    <TableHead className="text-pink-900 font-semibold">Khách hàng</TableHead>
                    <TableHead className="text-pink-900 font-semibold">Ngày</TableHead>
                    <TableHead className="text-pink-900 font-semibold">Loại</TableHead>
                    <TableHead className="text-pink-900 font-semibold">Trạng thái</TableHead>
                    <TableHead className="text-pink-900 font-semibold">Tổng tiền</TableHead>
                    <TableHead className="text-pink-900 font-semibold text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => {
                    const statusInfo = getStatusInfo(invoice);
                    return (
                      <TableRow
                        key={invoice.id}
                        className="border-b border-pink-50 last:border-0 hover:bg-pink-50/60 transition-colors"
                      >
                        <TableCell className="font-semibold text-gray-800">
                          {invoice.invoice_number}
                        </TableCell>
                        <TableCell className="text-gray-600">{invoice.customer_name}</TableCell>
                        <TableCell className="text-gray-600">{formatDate(invoice.date)}</TableCell>
                        <TableCell>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-600">
                            {invoice.template_type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-semibold',
                              statusInfo.className
                            )}
                          >
                            {statusInfo.label}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-gray-900">
                          {formatCurrency(invoice.total)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 justify-center">
                            <ActionIcon
                              icon={PencilLine}
                              label="Chỉnh sửa hóa đơn"
                              onClick={() => navigate(`/dashboard/invoices/${invoice.id}/edit`)}
                            />
                            <ActionIcon
                              icon={Eye}
                              label="Xem trước PDF"
                              onClick={() => handlePreview(invoice.id)}
                            />
                            <ActionIcon
                              icon={Trash2}
                              label="Xóa hóa đơn"
                              variant="danger"
                              onClick={() =>
                                setDeleteModal({ isOpen: true, invoiceId: invoice.id })
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, invoiceId: null })}
          title="Xác nhận xóa"
        >
          <p className="mb-4 text-gray-700">
            Bạn có chắc chắn muốn xóa hóa đơn này? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, invoiceId: null })}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </div>
        </Modal>

        <PdfPreviewModal
          isOpen={previewModal.isOpen}
          pdfUrl={previewModal.pdfUrl}
          isLoading={previewModal.isLoading}
          onClose={closePreviewModal}
        />
      </div>
    </DashboardLayout>
  );
};

