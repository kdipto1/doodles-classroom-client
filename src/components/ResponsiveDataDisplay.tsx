import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface DataItem {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: DataItem) => ReactNode;
  className?: string;
}

interface ResponsiveDataDisplayProps {
  data: DataItem[];
  columns: Column[];
  cardTitleKey?: string;
  cardSubtitleKey?: string;
  cardActions?: (item: DataItem) => ReactNode;
  emptyMessage?: string;
  loading?: boolean;
}

export function ResponsiveDataDisplay({
  data,
  columns,
  cardTitleKey,
  cardSubtitleKey,
  cardActions,
  emptyMessage = "No data available",
  loading = false,
}: ResponsiveDataDisplayProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4 sm:p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Mobile/Tablet Card Layout */}
      <div className="block lg:hidden space-y-4">
        {data.map((item) => (
          <Card key={item.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Card Header */}
              <div className="space-y-1">
                {cardTitleKey && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {item[cardTitleKey]}
                  </h3>
                )}
                {cardSubtitleKey && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item[cardSubtitleKey]}
                  </p>
                )}
              </div>

              {/* Card Content */}
              <div className="space-y-2">
                {columns.slice(0, 3).map((column) => (
                  <div key={column.key} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {column.label}:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]
                      }
                    </span>
                  </div>
                ))}
              </div>

              {/* Card Actions */}
              {cardActions && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  {cardActions(item)}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-zinc-700">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.className || ""}`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-600">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${column.className || ""}`}
                      >
                        {column.render
                          ? column.render(item[column.key], item)
                          : item[column.key]
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}