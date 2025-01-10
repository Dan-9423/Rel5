import { HelpCircle } from 'lucide-react';
import { Tooltip } from '@/components/common/Feedback/Tooltip';
import { cn } from '@/lib/utils';

interface HelpTooltipProps {
  content: string;
  className?: string;
}

export function HelpTooltip({ content, className }: HelpTooltipProps) {
  return (
    <Tooltip content={content}>
      <HelpCircle className={cn('h-4 w-4 text-muted-foreground', className)} />
    </Tooltip>
  );
}