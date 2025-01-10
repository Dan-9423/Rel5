import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "animate-pulse rounded-md bg-muted",
            className
          )}
        />
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-10 bg-muted rounded-md mb-4" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-16 bg-muted rounded-md mb-2" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-6 animate-pulse">
      <div className="h-6 w-1/3 bg-muted rounded mb-4" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/6 bg-muted rounded" />
      </div>
    </div>
  );
}