import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

export const WelcomeModal = ({ isOpen, initialName = '', onSubmit }) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName || '');
    }
  }, [initialName, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl shadow-pink-300/50 border border-pink-100">
        <div className="space-y-2 text-center mb-6">
          <h2 className="text-2xl font-bold text-pink-600">Chào bạn mới! 👋</h2>
          <p className="text-sm text-gray-500">
            Hãy cho InvoicePro biết tên của bạn để chúng tôi có thể chào đúng cách.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên bạn là gì?
            </label>
            <Input
              autoFocus
              placeholder="Nhập tên của bạn..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-pink-200 focus:ring-pink-400 focus:border-pink-400"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-2xl text-base"
            size="lg"
            disabled={!name.trim()}
          >
            Bắt đầu ngay
          </Button>
        </form>
      </div>
    </div>
  );
};
