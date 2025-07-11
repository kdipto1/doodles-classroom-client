// src/pages/TeacherAssignments.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Assignment {
  _id: string;
  title: string;
  description: string;
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
        const res = await axiosInstance.get(
          `/assignments/class/${classId}`,
        );
        setAssignments(res.data || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "teacher" && classId) {
      fetchAssignments();
    }
  }, [classId, user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading assignments...</span>
      </div>
    );
  if (assignments.length < 1)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-500">
          No assignments provided for this class...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-8">
          Assignments for this Class
        </h2>
        <div className="space-y-8">
          {assignments.map((assignment) => (
            <Card
              key={assignment._id}
              className="p-6 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                {assignment.title}
              </h3>
              <p className="text-gray-800 dark:text-gray-200 mb-2 whitespace-pre-wrap">
                {assignment.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
              <Button
                className="mt-4 w-full sm:w-auto"
                onClick={() =>
                  navigate(`/assignments/${assignment._id}/submissions`)
                }
              >
                View Submissions
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignments;
