import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonList } from "@/components/Skeleton";
import { useMyClasses, usePrefetchClass } from "@/hooks/queries";

import { BookOpen } from "lucide-react";

function MyClasses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefetchClass = usePrefetchClass();

  const { data: classes, isLoading, isError, error } = useMyClasses();

  // Handle mouse enter to prefetch class data for better UX
  const handleClassHover = (classId: string) => {
    prefetchClass(classId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-2 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-8 animate-pulse"></div>
          <SkeletonList count={6} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Error"
        description={`Failed to load classes: ${error?.message}`}
      />
    );
  }

  if (!classes || classes.length === 0) {
    const actionLabel =
      user?.role === "teacher" ? "Create Class" : "Join Class";
    const actionPath =
      user?.role === "teacher" ? "/classes/create" : "/classes/join";

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          icon={<BookOpen className="h-8 w-8 text-gray-400" />}
          title="No classes found"
          description={
            user?.role === "teacher"
              ? "You haven't created any classes yet. Create your first class to get started."
              : "You haven't joined any classes yet. Join a class using a class code to get started."
          }
          action={{
            label: actionLabel,
            onClick: () => navigate(actionPath),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-6 sm:mb-8">
          My Classes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {classes.map((cls) => (
            <Card
              key={cls._id}
              className="p-4 sm:p-6 bg-gradient-to-br from-blue-100 to-white dark:from-blue-950 dark:to-zinc-800 border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              onMouseEnter={() => handleClassHover(cls._id)}
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2 line-clamp-2">
                {cls.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-1">
                Subject: <span className="font-medium">{cls.subject}</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-1">
                Teacher:{" "}
                <span className="font-medium">
                  {cls.teacher?.name || "N/A"}
                </span>
              </p>
              {user?.role === "teacher" && (
                <p className="text-xs sm:text-sm mt-2 text-zinc-500 dark:text-zinc-400">
                  Code:{" "}
                  <span className="font-mono bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded text-blue-800 dark:text-blue-200 text-xs">
                    {cls.code}
                  </span>
                </p>
              )}
              <div className="mt-4">
                {user?.role === "student" && (
                  <Button
                    onClick={() => navigate(`/classes/${cls._id}/assignments`)}
                    size="sm"
                    className="w-full text-sm"
                  >
                    View Assignments
                  </Button>
                )}
                {user?.role === "teacher" && (
                  <Button
                    onClick={() =>
                      navigate(`/classes/${cls._id}/assignments/teacher`)
                    }
                    size="sm"
                    className="w-full text-sm"
                  >
                    Manage Class
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyClasses;
