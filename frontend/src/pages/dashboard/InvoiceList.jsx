import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, invoiceId: null });
  const [previewModal, setPreviewModal] = useState({ isOpen: false, pdfUrl: '', isLoading: false });

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    return () => {
      if (previewModal.pdfUrl) {
        URL.revokeObjectURL(previewModal.pdfUrl);
      }
    };
  }, [previewModal.pdfUrl]);

  const fetchInvoices = async (keyword = '') => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (keyword) {
        params.search = keyword;
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

  const handleSearch = (event) => {
    event.preventDefault();
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
      alert('Không thể xoá hóa đơn.');
    }
  };

  const getStatusInfo = (invoice) => {
    const status = (invoice.meta?.status || 'pending').toLowerCase();
    switch (status) {
      case 'paid':
        return { label: 'Đã thanh toán', className: 'bg-green-100 text-green-700' };
      case 'overdue':
        return { label: 'Quá hạn', className: 'bg-red-100 text-red-600' };
      default:
        return { label: 'Chờ xử lý', className: 'bg-amber-100 text-amber-700' };
    }
  };

  const ActionIcon = ({ icon: Icon, label, variant = 'default', ...rest }) => (
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

  const handlePreview = async (invoiceId) => {
    setPreviewModal({ isOpen: true, pdfUrl: '', isLoading: true });
    try {
      const response = await fetch(invoiceAPI.getPDFUrl(invoiceId));
      if (!response.ok) {
        throw new Error('Không thể tải PDF');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewModal({ isOpen: true, pdfUrl: url, isLoading: false });
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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-500 font-semibold">
          Quản lý hóa đơn
        </p>
        <h1 className="text-3xl font-bold text-gray-900">Danh sách hóa đơn</h1>
        <p className="text-gray-600">
          Theo dõi trạng thái, xem trước PDF và thao tác nhanh chỉ trong vài cú click.
        </p>
      </div>

      <Card className="bg-white/80 backdrop-blur border border-pink-50">
        <CardContent className="p-5">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Tìm theo mã, khách hàng hoặc ghi chú..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="primary" className="md:w-auto w-full">
              <Search className="w-4 h-4 mr-2" /> Tìm kiếm
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hóa đơn ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : invoices.length === 0 ? (
            <div className="py-10 text-center text-gray-500">Chưa có hóa đơn nào.</div>
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
                      <TableCell className="font-semibold text-gray-900">
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
                        <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', statusInfo.className)}>
                          {statusInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold text-gray-900">
                        {formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-3">
                          <ActionIcon
                            icon={PencilLine}
                            label="Chỉnh sửa"
                            onClick={() => navigate(`/dashboard/invoices/${invoice.id}/edit`)}
                          />
                          <ActionIcon
                            icon={Eye}
                            label="Xem trước PDF"
                            onClick={() => handlePreview(invoice.id)}
                          />
                          <ActionIcon
                            icon={Trash2}
                            label="Xoá"
                            variant="danger"
                            onClick={() => setDeleteModal({ isOpen: true, invoiceId: invoice.id })}
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

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, invoiceId: null })}
        title="Xác nhận xoá"
      >
        <p className="mb-4 text-gray-600">
          Bạn chắc chắn muốn xoá hóa đơn này? Thao tác sẽ không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, invoiceId: null })}>
            Huỷ
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xoá
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
  );
};
