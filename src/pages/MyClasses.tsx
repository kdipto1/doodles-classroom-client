import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ClassItem {
  _id: string;
  name: string;
  subject: string;
  code: string;
  teacher: {
    name: string;
    email: string;
  };
}

function MyClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/classes/my", {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      console.log(res.data);
      setClasses(res.data || []);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading classes...</span>
      </div>
    );

  if (classes.length === 0) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="text-lg text-gray-500">No classes found</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          My Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-blue-100 to-white border border-blue-200 hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                {cls.name}
              </h3>
              <p className="text-sm text-gray-700 mb-1">
                Subject: <span className="font-medium">{cls.subject}</span>
              </p>
              <p className="text-sm text-gray-700 mb-1">
                Teacher:{" "}
                <span className="font-medium">
                  {cls.teacher?.name || "N/A"}
                </span>{" "}
                ({cls.teacher?.email})
              </p>
              {user?.role === "teacher" && (
                <p className="text-sm mt-2 text-zinc-500">
                  Class Code:{" "}
                  <span className="font-mono bg-zinc-100 px-2 py-1 rounded text-blue-800">
                    {cls.code}
                  </span>
                </p>
              )}
              {user?.role === "student" && (
                <button
                  onClick={() => navigate(`/classes/${cls._id}/assignments`)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  Class Assignments
                </button>
              )}
              {user?.role === "teacher" && (
                <button
                  onClick={() =>
                    navigate(`/classes/${cls._id}/assignments/teacher`)
                  }
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  Class Assignments
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyClasses;
