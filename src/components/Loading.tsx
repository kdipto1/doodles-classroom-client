import { Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function Loading({ message = 'Loading...', fullScreen = false, className = '' }: LoadingProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        {content}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="py-12">
        {content}
      </CardContent>
    </Card>
  );
}

export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <Loader2 className={`h-4 w-4 animate-spin ${className}`} />
  );
}
