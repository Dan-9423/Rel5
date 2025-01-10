import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions
}: PageHeaderProps) {
  return (
    <div className="space-y-4 mb-8">
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
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
  );
}