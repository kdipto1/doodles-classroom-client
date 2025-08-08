import type { ReactNode } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}: EmptyStateProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        {icon && (
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
            {icon}
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              {description}
            </p>
          )}
        </div>

        {action && (
          <Button onClick={action.onClick} className="mt-4">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
