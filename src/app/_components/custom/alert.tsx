import { cn } from '@/src/lib/utils';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
  className?: string;
}

const variants = {
  success: {
    icon: CheckCircle2,
    base: 'border-green-500/40 bg-green-500/10 text-green-700',
  },
  error: {
    icon: XCircle,
    base: 'border-red-500/40 bg-red-500/10 text-red-700',
  },
  warning: {
    icon: AlertTriangle,
    base: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-700',
  },
  info: {
    icon: Info,
    base: 'border-blue-500/40 bg-blue-500/10 text-blue-700',
  },
};

export function Alert({ variant = 'info', title, description, className }: AlertProps) {
  const Icon = variants[variant].icon;

  return (
    <div
      className={cn(
        'flex w-full gap-3 rounded-xl border p-4 shadow-sm',
        variants[variant].base,
        className,
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex flex-col">
        {title && <p className="font-semibold leading-tight">{title}</p>}
        {description && (
          <p className="text-sm opacity-90 leading-snug">{description}</p>
        )}
      </div>
    </div>
  );
}