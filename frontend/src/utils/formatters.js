import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility để merge Tailwind classes
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Format tiền tệ VND
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(Number(amount));
};

// Format ngày tháng
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // Return in dd-mm-yyyy as requested
    return `${day}-${month}-${year}`;
};

// Format ngày cho input date (YYYY-MM-DD)
export const formatDateInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Parse a displayed date in dd-mm-yyyy to ISO YYYY-MM-DD
export const parseDisplayDate = (display) => {
    if (!display) return '';
    const m = display.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!m) return '';
    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = Number(m[3]);
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return '';
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// Validate displayed date dd-mm-yyyy
export const isValidDisplayDate = (display) => Boolean(parseDisplayDate(display));

