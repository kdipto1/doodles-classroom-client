import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "../api/axios";
import axios from "axios";
import { getData } from "@/api/response";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  mySubmission?: {
    submittedAt: string;
    marks?: number;
  };
}

function ClassAssignments() {
  const { classId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axiosInstance.get(`/assignments/class/${classId}`);
        const data = getData<Assignment[]>(res);
        setAssignments(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          toast.error(
            err.response?.data?.message || "Failed to load assignments"
          );
        } else {
          toast.error(
            "An unexpected error occurred while loading assignments."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "student" && classId) {
      fetchAssignments();
    }
  }, [classId, user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading assignments...</span>
      </div>
    );

  if (assignments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-500">No assignments found</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-8">
          Assignments
        </h2>
        <div className="space-y-8">
          {assignments.map((assignment) => (
            <Card
              key={assignment._id}
              className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-zinc-800 border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                {assignment.title}
              </h3>
              <p className="text-gray-800 dark:text-gray-200 mb-2 whitespace-pre-wrap">
                {assignment.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Due:{" "}
                <span className="font-medium">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </p>

              {/* Submission status chip */}
              <div className="mt-2 mb-4">
                {assignment.mySubmission ? (
                  <>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Submitted
                    </span>
                    {assignment.mySubmission.marks !== undefined && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium ml-2">
                        Graded
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Not Submitted
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  disabled={!!assignment.mySubmission}
                  className="w-full sm:w-auto"
                  onClick={() =>
                    navigate(`/assignments/${assignment._id}/submit`)
                  }
                >
                  {assignment.mySubmission ? "Submitted" : "Submit"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    navigate(`/assignments/${assignment._id}/my-submission`)
                  }
                >
                  View My Submission
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClassAssignments;
