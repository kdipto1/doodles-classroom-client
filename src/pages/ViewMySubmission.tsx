import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { useMySubmission, useAssignment } from "@/hooks/queries";
import {
  FileText,
  Clock,
  CheckCircle,
  Star,
  MessageSquare,
} from "lucide-react";

function ViewMySubmission() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: assignment, isLoading: assignmentLoading } = useAssignment(
    assignmentId!,
    !!assignmentId
  );

  const {
    data: submission,
    isLoading: submissionLoading,
    isError: submissionError,
    error: submissionErrorDetails,
  } = useMySubmission(
    assignmentId!,
    !!assignmentId && user?.role === "student"
  );

  if (assignmentLoading || submissionLoading) {
    return <Loading message="Loading your submission..." fullScreen />;
  }

  if (submissionError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="No Submission Found"
          description={
            submissionErrorDetails?.message ||
            "You haven't submitted this assignment yet or access is denied."
          }
          action={{
            label: "Submit Assignment",
            onClick: () => navigate(`/assignments/${assignmentId}/submit`),
          }}
        />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          icon={<FileText className="h-16 w-16 text-gray-400" />}
          title="No Submission Yet"
          description="You haven't submitted this assignment yet."
          action={{
            label: "Submit Now",
            onClick: () => navigate(`/assignments/${assignmentId}/submit`),
          }}
        />
      </div>
    );
  }

  const isGraded = submission.marks !== null && submission.marks !== undefined;
  const submissionDate = new Date(submission.submittedAt);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Assignment Header */}
        {assignment && (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {assignment.title}
                </h1>
              </div>

              {assignment.description && (
                <p className="text-blue-700 dark:text-blue-300">
                  {assignment.description}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Submission Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              My Submission
            </h2>
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Submitted
              </Badge>
              {isGraded && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1"
                >
                  <Star className="h-4 w-4" />
                  Graded
                </Badge>
              )}
            </div>
          </div>

          {/* Submission Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Submitted on: {submissionDate.toLocaleString()}</span>
            </div>

            {/* Submission Content */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Submission Content
              </h3>
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {submission.submissionText}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Grading Information */}
        {isGraded && (
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Grading Results
            </h3>

            <div className="space-y-4">
              {/* Score */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Score:
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-lg px-3 py-1"
                  >
                    {submission.marks}/100
                  </Badge>
                </div>

                {/* Score visualization */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(submission.marks || 0, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {submission.marks}% achieved
                  </p>
                </div>
              </div>

              {/* Feedback */}
              {submission.feedback && (
                <div>
                  <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Teacher Feedback
                  </h4>
                  <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {submission.feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Pending Grading */}
        {!isGraded && (
          <Card className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border-yellow-200 dark:border-yellow-800">
            <div className="text-center py-4">
              <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Awaiting Grading
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Your submission has been received and is pending review by your
                teacher.
              </p>
            </div>
          </Card>
        )}

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(`/assignments/${assignmentId}`)}
            className="flex items-center gap-2"
          >
            View Assignment Details
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/classes")}
            className="flex items-center gap-2"
          >
            ← Back to Classes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ViewMySubmission;
