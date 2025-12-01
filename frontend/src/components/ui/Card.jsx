import { cn } from '../../utils/formatters';

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-lg shadow-pink-100 border border-pink-50 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 className={cn('text-xl font-semibold text-gray-800', className)} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={cn('text-gray-600', className)} {...props}>
      {children}
    </div>
  );
};

