import { ReactNode } from 'react';
import { Tooltip } from '@/components/common/Feedback/Tooltip';
import { cn } from '@/lib/utils';

interface FeatureTooltipProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function FeatureTooltip({
  title,
  description,
  children,
  className
}: FeatureTooltipProps) {
  return (
    <Tooltip
      content={
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted">{description}</p>
        </div>
      }
    >
      <div className={cn('cursor-help', className)}>{children}</div>
    </Tooltip>
  );
}