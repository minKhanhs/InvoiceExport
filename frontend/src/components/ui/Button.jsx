import { cn } from '../../utils/formatters';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-300 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-white border border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700',
    outline:
      'border border-gray-200 text-gray-700 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50/40',
    danger:
      'bg-red-500 text-white shadow shadow-red-200 hover:bg-red-600',
    ghost:
      'text-pink-600 hover:bg-pink-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

