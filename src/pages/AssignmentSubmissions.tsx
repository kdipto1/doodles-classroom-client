import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import axios from "axios";
import { getData } from "@/api/response";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Submission {
  _id: string;
  submissionText: string;
  submittedAt: string;
  studentId: {
    name: string;
    email: string;
  };
  marks: number | null;
  feedback: string;
}

interface GradingState {
  [id: string]: {
    marks: string;
    feedback: string;
  };
}

function AssignmentSubmissions() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<GradingState>({});
  const [editEnabled, setEditEnabled] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axiosInstance.get(
          `/submissions/assignment/${assignmentId}`
        );
        const data = getData<Submission[]>(res);
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          toast.error(
            err?.response?.data?.message || "Failed to fetch submissions"
          );
        } else {
          toast.error(
            "An unexpected error occurred while fetching submissions."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId && user?.role === "teacher") {
      fetchSubmissions();
    }
  }, [assignmentId, user, grading]);

  const handleGradeChange = (id: string, field: string, value: string) => {
    setGrading((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleGradeSubmit = async (submissionId: string) => {
    try {
      const { marks, feedback } = grading[submissionId] || {};
      if (!marks) {
        toast("Marks are required");
        return;
      }
      const res = await axiosInstance.patch(
        `/submissions/${submissionId}/grade`,
        {
          marks: parseInt(marks),
          feedback,
        }
      );
      toast(res.data.message || "Grade submitted!");
      // Optionally, refresh the submissions to reflect the changes
      const updatedSubmissions = submissions.map((sub) =>
        sub._id === submissionId
          ? { ...sub, marks: parseInt(marks), feedback }
          : sub
      );
      setSubmissions(updatedSubmissions);
      setEditEnabled((prev) => ({ ...prev, [submissionId]: false }));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to submit grade");
      } else {
        toast.error("An unexpected error occurred while submitting grade.");
      }
    }
  };

  const enableEdit = (submissionId: string) => {
    setEditEnabled((prev) => ({ ...prev, [submissionId]: true }));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading submissions...</span>
      </div>
    );

  if (submissions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-500">No submissions found</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-8">
          Student Submissions
        </h2>
        <div className="space-y-8">
          {submissions.map((sub) => (
            <Card
              key={sub._id}
              className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-zinc-800 border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  {sub.studentId.name}{" "}
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    ({sub.studentId.email})
                  </span>
                </p>
                {typeof sub.marks === "number" ? (
                  <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-3 py-1 rounded-full font-semibold mt-2 md:mt-0">
                    Graded
                  </span>
                ) : (
                  <span className="inline-block bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs px-3 py-1 rounded-full font-semibold mt-2 md:mt-0">
                    Pending
                  </span>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-zinc-700 rounded p-3 mb-2">
                {sub.submissionText}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Submitted: {new Date(sub.submittedAt).toLocaleString()}
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                <div>
                  <label
                    htmlFor={`marks-${sub._id}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Marks
                  </label>
                  <Input
                    id={`marks-${sub._id}`}
                    type="number"
                    placeholder="Marks"
                    defaultValue={sub.marks || ""}
                    onChange={(e) =>
                      handleGradeChange(sub._id, "marks", e.target.value)
                    }
                    aria-invalid={
                      !grading[sub._id]?.marks && sub.marks === null
                        ? "true"
                        : "false"
                    }
                    disabled={!editEnabled[sub._id] && sub.marks !== null}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`feedback-${sub._id}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Feedback
                  </label>
                  <Textarea
                    id={`feedback-${sub._id}`}
                    placeholder="Feedback"
                    defaultValue={sub.feedback || ""}
                    onChange={(e) =>
                      handleGradeChange(sub._id, "feedback", e.target.value)
                    }
                    disabled={!editEnabled[sub._id] && sub.marks !== null}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end mt-2 space-x-2">
                  {sub.marks !== null && !editEnabled[sub._id] && (
                    <Button
                      variant="outline"
                      onClick={() => enableEdit(sub._id)}
                    >
                      Enable Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => handleGradeSubmit(sub._id)}
                    disabled={!editEnabled[sub._id] && sub.marks !== null}
                  >
                    Submit Grade
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssignmentSubmissions;
