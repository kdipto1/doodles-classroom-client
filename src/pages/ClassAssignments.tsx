import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Assignment {
  _id: string;
  title: string;
  instructions: string;
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
        const res = await axios.get(
          `http://localhost:5000/api/v1/assignments/class/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        );

        setAssignments(res.data || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("Failed to load assignments");
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
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading assignments...</span>
      </div>
    );

  if (assignments.length === 0) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="text-lg text-gray-500">No assignments found</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Assignments
        </h2>
        <div className="space-y-8">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                {assignment.title}
              </h3>
              <p className="text-gray-800 mb-2 whitespace-pre-wrap">
                {assignment.instructions}
              </p>
              <p className="text-sm text-gray-500">
                Due:{" "}
                <span className="font-medium">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </p>

              {/* Submission status chip */}
              <div className="mt-2 mb-4">
                {assignment.mySubmission ? (
                  <>
                    <span className="text-xs text-green-600 font-medium">
                      Submitted
                    </span>
                    {assignment.mySubmission.marks !== undefined && (
                      <span className="text-xs text-blue-600 font-medium ml-2">
                        Graded
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-red-600 font-medium">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClassAssignments;
