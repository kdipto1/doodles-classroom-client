import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
        const res = await axios.get(
          `http://localhost:5000/api/v1/submissions/assignment/${assignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        );
        setSubmissions(res.data || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("Failed to fetch submissions");
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
      const res = await axios.patch(
        `http://localhost:5000/api/v1/submissions/${submissionId}/grade`,
        {
          marks: parseInt(marks),
          feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to submit grade");
    }
  };

  const enableEdit = (submissionId: string) => {
    setEditEnabled((prev) => ({ ...prev, [submissionId]: true }));
  };

  if (loading)
    return <p className="text-center mt-6">Loading submissions...</p>;

  if (submissions.length === 0) {
    return (
      <p className="min-h-screen text-center mt-6 text-red-500">
        No submissions found
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Student Submissions
        </h2>
        <div className="space-y-8">
          {submissions.map((sub) => (
            <div
              key={sub._id}
              className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <p className="text-lg font-semibold text-blue-700">
                  {sub.studentId.name}{" "}
                  <span className="text-gray-500 text-sm">
                    ({sub.studentId.email})
                  </span>
                </p>
                {typeof sub.marks === "number" ? (
                  <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold mt-2 md:mt-0">
                    Graded
                  </span>
                ) : (
                  <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold mt-2 md:mt-0">
                    Pending
                  </span>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-gray-800 bg-gray-100 rounded p-3 mb-2">
                {sub.submissionText}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Submitted: {new Date(sub.submittedAt).toLocaleString()}
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-white p-4 rounded-xl border border-gray-200">
                <div>
                  <label
                    htmlFor={`marks-${sub._id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!editEnabled[sub._id] && sub.marks !== null}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`feedback-${sub._id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!editEnabled[sub._id] && sub.marks !== null}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end mt-2 space-x-2">
                  {sub.marks !== null && !editEnabled[sub._id] && (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                      onClick={() => enableEdit(sub._id)}
                    >
                      Enable Edit
                    </button>
                  )}
                  <button
                    className={`bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-2 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${
                      !editEnabled[sub._id] && sub.marks !== null
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => handleGradeSubmit(sub._id)}
                    disabled={!editEnabled[sub._id] && sub.marks !== null}
                  >
                    Submit Grade
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssignmentSubmissions;
