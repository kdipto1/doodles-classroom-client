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
              Authorization: `Bearer ${user?.data.accessToken}`,
            },
          }
        );
        setSubmission(res.data.submission);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("No submission found or access denied");
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId && user?.data.role === "student") {
      fetchSubmission();
    }
  }, [assignmentId, user]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!submission)
    return (
      <p className="text-center mt-6">
        You haven’t submitted this assignment yet.
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4">My Submission</h2>
      <p className="whitespace-pre-wrap text-gray-800 mb-2">
        {submission.submissionText}
      </p>
      <p className="text-xs text-gray-500 mb-4">
        Submitted: {new Date(submission.submittedAt).toLocaleString()}
      </p>

      {submission.marks !== undefined ? (
        <>
          <p className="text-green-700 font-semibold">
            Marks: {submission.marks}
          </p>
          <p className="text-gray-700 mt-2">
            <span className="font-medium">Feedback:</span> {submission.feedback}
          </p>
        </>
      ) : (
        <p className="text-yellow-600 font-semibold">Status: Pending Grading</p>
      )}
    </div>
  );
}

export default ViewMySubmission;
