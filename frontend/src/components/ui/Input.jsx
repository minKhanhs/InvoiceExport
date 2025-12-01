import { cn } from '../../utils/formatters';

export const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

