import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(user);

  const [stats, setStats] = useState({
    classes: 0,
    assignments: 0,
    upcoming: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/dashboard", {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error", err);
      }
    };

    fetchDashboardStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
          Welcome {user?.name}!{" "}
          <span className="text-2xl" role="img" aria-label="wave">
            👋
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex flex-col items-center">
            <p className="text-sm text-blue-700 font-medium mb-2">
              {user?.role === "teacher" ? "Classes Created" : "Classes Joined"}
            </p>
            <p className="text-4xl font-bold text-blue-900">{stats?.classes}</p>
          </div>

          <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-green-100 to-green-50 border border-green-200 flex flex-col items-center">
            <p className="text-sm text-green-700 font-medium mb-2">
              {user?.role === "teacher"
                ? "Assignments Created"
                : "Assignments Received"}
            </p>
            <p className="text-4xl font-bold text-green-900">
              {stats?.assignments}
            </p>
          </div>

          <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-200 flex flex-col items-center">
            <p className="text-sm text-yellow-700 font-medium mb-2">
              Upcoming Due
            </p>
            <p className="text-4xl font-bold text-yellow-900">
              {stats?.upcoming}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          {user?.role === "teacher" ? (
            <>
              <button
                onClick={() => navigate("/classes/create")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                + Create Class
              </button>
              <button
                onClick={() => navigate("/assignments/create")}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                + New Assignment
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/classes/join")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              + Join Class
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
