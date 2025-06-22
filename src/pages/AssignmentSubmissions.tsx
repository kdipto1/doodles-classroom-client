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
  student: {
    name: string;
    email: string;
  };
  marks: string;
}

function AssignmentSubmissions() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  /// ++
  const [grading, setGrading] = useState<{
    [id: string]: { marks: string; feedback: string };
  }>({});
  //++

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/submissions/assignment/${assignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.data.accessToken}`,
            },
          }
        );
        setSubmissions(res.data.submissions || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId && user?.data.role === "teacher") {
      fetchSubmissions();
    }
  }, [assignmentId, user]);

  if (loading)
    return <p className="text-center mt-6">Loading submissions...</p>;

  if (submissions.length === 0) {
    return <p className="text-center mt-6">No submissions found</p>;
  }

  // +++++++++++++++++

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
      await axios.patch(
        `http://localhost:5000/api/v1/submissions/${submissionId}/grade`,
        {
          marks: parseInt(marks),
          feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.data.accessToken}`,
          },
        }
      );
      toast("Grade submitted!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to submit grade");
    }
  };
  // ++++++++++++++++

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Student Submissions</h2>
      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub._id} className="border rounded-xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">
              {sub.student.name} ({sub.student.email})
            </p>
            <p className="mt-2 whitespace-pre-wrap text-gray-800">
              {sub.submissionText}
            </p>
            {typeof sub.marks === "number" ? (
              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Graded
              </span>
            ) : (
              <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                Pending
              </span>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Submitted: {new Date(sub.submittedAt).toLocaleString()}
            </p>

            {/* Grading UI */}
            <div className="mt-4 space-y-2">
              <Input
                type="number"
                placeholder="Marks"
                value={grading[sub._id]?.marks || ""}
                onChange={(e) =>
                  handleGradeChange(sub._id, "marks", e.target.value)
                }
              />
              <Textarea
                placeholder="Feedback"
                value={grading[sub._id]?.feedback || ""}
                onChange={(e) =>
                  handleGradeChange(sub._id, "feedback", e.target.value)
                }
              />

              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleGradeSubmit(sub._id)}
              >
                Submit Grade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssignmentSubmissions;
