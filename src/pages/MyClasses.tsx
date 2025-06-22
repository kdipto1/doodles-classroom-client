import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface ClassItem {
  _id: string;
  name: string;
  subject: string;
  classCode: string;
  teacher: {
    name: string;
    email: string;
  };
}

function MyClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/classes/my", {
        headers: {
          Authorization: `Bearer ${user?.data.accessToken}`,
        },
      });
      console.log(res.data.class);
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
  }, []);

  if (loading) return <p className="text-center mt-6">Loading classes...</p>;

  if (classes.length === 0) {
    return <p className="text-center mt-6">No classes found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6">My Classes</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <div key={cls._id} className="border rounded-xl p-4 shadow-sm">
            <h3 className="text-xl font-semibold text-blue-600">{cls.name}</h3>
            <p className="text-sm text-gray-600">Subject: {cls.subject}</p>
            <p className="text-sm text-gray-600">
              Teacher: {cls.teacher?.name || "N/A"} ({cls.teacher?.email})
            </p>
            {user?.data.role === "teacher" && (
              <p className="text-sm mt-1 text-zinc-500">
                Class Code: <span className="font-mono">{cls.classCode}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyClasses;
