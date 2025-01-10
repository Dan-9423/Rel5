import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function ProgressBar({
  progress,
  className,
  showLabel = false,
  size = 'md',
  variant = 'default'
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className="w-full">
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size], className)}>
        <div
          className={cn(
            'transition-all duration-500 ease-out rounded-full',
            sizeClasses[size],
            variantClasses[variant]
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 mt-1">{Math.round(progress)}%</span>
      )}
    </div>
  );
}