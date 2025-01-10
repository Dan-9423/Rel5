import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  noPadding?: boolean;
}

export function Card({
  title,
  description,
  children,
  className,
  actions,
  footer,
  noPadding = false,
}: CardProps) {
  return (
    <div className={cn(
      'bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg',
      className
    )}>
      {(title || description || actions) && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={cn(!noPadding && 'p-6')}>{children}</div>
      {footer && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          {footer}
        </div>
      )}
    </div>
  );
}