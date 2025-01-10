import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ 
  message = 'Carregando...', 
  fullScreen = false 
}: LoadingOverlayProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 bg-background/80 backdrop-blur-sm"
    : "absolute inset-0 bg-background/50";

  return (
    <div className={`${containerClasses} flex items-center justify-center z-50`}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}