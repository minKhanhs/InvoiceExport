import { useEffect, useState } from 'react';
import { FileText, Download, X, Loader2 } from 'lucide-react';
import { Button } from './Button';

const PdfPreviewModal = ({ isOpen, onClose, pdfUrl, isLoading }) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    setIframeLoading(Boolean(pdfUrl));
  }, [pdfUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'invoice.pdf';
    link.click();
  };

  const showLoader = isLoading || iframeLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-11/12 max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-semibold">Xem trước hóa đơn</p>
              <p className="text-sm text-white/80">Xem nhanh file PDF trước khi tải xuống</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full p-2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 border-white/30 text-white"
              onClick={handleDownload}
              disabled={!pdfUrl}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full p-2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 border-white/30 text-white"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 relative bg-gray-100">
          {showLoader && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-pink-600 bg-white/70">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-sm font-medium">Đang tải tài liệu...</p>
            </div>
          )}

          {!isLoading && !pdfUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500">
              <p className="text-lg font-semibold">Không thể hiển thị PDF</p>
              <p className="text-sm">Vui lòng thử lại sau.</p>
            </div>
          )}

          {pdfUrl && (
            <iframe
              src={pdfUrl}
              title="Invoice PDF Preview"
              className="w-full h-full border-0"
              onLoad={() => setIframeLoading(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;

