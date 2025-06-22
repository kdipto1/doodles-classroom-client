import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    classes: 0,
    assignments: 0,
    upcoming: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/dashboard", {
          headers: { Authorization: `Bearer ${user?.data.accessToken}` },
        });
        console.log(res);
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error", err);
      }
    };

    fetchDashboardStats();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 space-y-6">
      <h1 className="text-2xl font-bold">Welcome {user?.data.name}! 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4 shadow-sm bg-blue-50">
          <p className="text-sm text-gray-600">
            {user?.data.role === "teacher"
              ? "Classes Created"
              : "Classes Joined"}
          </p>
          <p className="text-xl font-semibold">{stats.classes}</p>
        </div>

        <div className="border rounded-xl p-4 shadow-sm bg-green-50">
          <p className="text-sm text-gray-600">
            {user?.data.role === "teacher"
              ? "Assignments Created"
              : "Assignments Received"}
          </p>
          <p className="text-xl font-semibold">{stats.assignments}</p>
        </div>

        <div className="border rounded-xl p-4 shadow-sm bg-yellow-50">
          <p className="text-sm text-gray-600">Upcoming Due</p>
          <p className="text-xl font-semibold">{stats.upcoming}</p>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        {user?.data.role === "teacher" ? (
          <>
            <button
              onClick={() => navigate("/classes/create")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              + Create Class
            </button>
            <button
              onClick={() => navigate("/assignments/create")}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              + New Assignment
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/classes/join")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            + Join Class
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
