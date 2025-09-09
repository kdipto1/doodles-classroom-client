import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkeletonDashboard } from "@/components/Skeleton";
import { useDashboardStats } from "@/hooks/queries";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: stats, isLoading, isError, error } = useDashboardStats();

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">
        Error loading dashboard: {error?.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-6 sm:space-y-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-4">
          Welcome {user?.name}!{" "}
          <span className="text-xl sm:text-2xl" role="img" aria-label="wave">
            👋
          </span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
              {user?.role === "teacher" ? "Classes Created" : "Classes Joined"}
            </p>
            <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">
              {stats?.classes ?? 0}
            </p>
          </Card>

          <Card className="flex flex-col items-center p-6 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-2">
              {user?.role === "teacher"
                ? "Assignments Created"
                : "Assignments Received"}
            </p>
            <p className="text-4xl font-bold text-green-900 dark:text-green-100">
              {stats?.assignments ?? 0}
            </p>
          </Card>

          <Card className="flex flex-col items-center p-6 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-950 dark:to-yellow-900 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-2">
              Upcoming Due
            </p>
            <p className="text-4xl font-bold text-yellow-900 dark:text-yellow-100">
              {stats?.upcoming ?? 0}
            </p>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 px-4">
          {user?.role === "teacher" ? (
            <>
              <Button
                onClick={() => navigate("/classes/create")}
                size="lg"
                className="w-full sm:w-auto px-6 py-3 text-base"
              >
                + Create Class
              </Button>
              <Button
                onClick={() => navigate("/assignments/create")}
                size="lg"
                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-base"
              >
                + New Assignment
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/classes/join")}
              size="lg"
              className="w-full sm:w-auto px-6 py-3 text-base"
            >
              + Join Class
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
