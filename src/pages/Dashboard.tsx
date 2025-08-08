import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/Loading";
import { dashboardStatsSchema, type DashboardStats, preprocessDashboardStats } from "@/lib/validation";
import { useApi } from "@/hooks/useApi";
import { getData, getMessage } from "@/api/response";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: stats,
    loading,
    execute: fetchStats,
  } = useApi<DashboardStats>({
    responseSchema: dashboardStatsSchema,
  });
  console.log(stats);
  useEffect(() => {
    fetchStats(async () => {
      const res = await axiosInstance.get("/dashboard");
      console.log('Raw dashboard response:', res.data);
      const extractedData = getData<any>(res);
      console.log('Extracted data:', extractedData);
      const preprocessedData = preprocessDashboardStats(extractedData);
      console.log('Preprocessed data:', preprocessedData);
      return { data: preprocessedData, message: getMessage(res) || 'Dashboard stats retrieved successfully' };
    });
  }, [fetchStats]);

  if (loading) {
    return <Loading message="Loading dashboard data..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-4">
          Welcome {user?.name}!{" "}
          <span className="text-2xl" role="img" aria-label="wave">
            👋
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          {user?.role === "teacher" ? (
            <>
              <Button
                onClick={() => navigate("/classes/create")}
                className="px-6 py-3"
              >
                + Create Class
              </Button>
              <Button
                onClick={() => navigate("/assignments/create")}
                className="px-6 py-3 bg-green-600 hover:bg-green-700"
              >
                + New Assignment
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/classes/join")}
              className="px-6 py-3"
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
