// src/pages/TeacherAssignments.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface Assignment {
  _id: string;
  title: string;
  instructions: string;
  dueDate: string;
}

function TeacherAssignments() {
  const { classId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/assignments/class/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.data.accessToken}`,
            },
          }
        );
        setAssignments(res.data || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        alert("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    if (user?.data.role === "teacher" && classId) {
      fetchAssignments();
    }
  }, [classId, user]);

  if (loading)
    return <p className="text-center mt-6">Loading assignments...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Assignments for this Class</h2>
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="border p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700">
              {assignment.title}
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {assignment.instructions}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </p>
            <Button
              className="mt-2"
              onClick={() =>
                navigate(`/assignments/${assignment._id}/submissions`)
              }
            >
              View Submissions
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherAssignments;
