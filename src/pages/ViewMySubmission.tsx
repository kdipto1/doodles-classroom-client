import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Submission {
  submissionText: string;
  submittedAt: string;
  marks?: number;
  feedback?: string;
}

function ViewMySubmission() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/submissions/my/${assignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        );
        setSubmission(res.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("No submission found or access denied");
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId && user?.role === "student") {
      fetchSubmission();
    }
  }, [assignmentId, user]);

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="text-lg text-gray-500">Loading...</span>
      </div>
    );
  if (!submission)
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="text-lg text-gray-500">
          You haven’t submitted this assignment yet.
        </span>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-2">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
          My Submission
        </h2>
        <p className="whitespace-pre-wrap text-gray-800 bg-gray-100 rounded p-4 mb-4">
          {submission.submissionText}
        </p>
        <p className="text-xs text-gray-500 mb-6 text-center">
          Submitted: {new Date(submission.submittedAt).toLocaleString()}
        </p>

        {submission.marks !== undefined ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-700 font-bold text-lg mb-2">
              Marks: {submission.marks}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Feedback:</span>{" "}
              {submission.feedback}
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-600 font-semibold">
              Status: Pending Grading
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewMySubmission;
