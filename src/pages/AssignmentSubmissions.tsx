import type { Submission } from "@/lib/validation";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/Loading";
import {
  useSubmissionsByAssignment,
  useAssignment,
  useGradeSubmissionMutation,
} from "@/hooks/queries";
import {
  FileText,
  Users,
  Clock,
  Star,
  CheckCircle,
  Edit,
  Save,
  X,
} from "lucide-react";

interface GradingState {
  [id: string]: {
    marks: string;
    feedback: string;
  };
}

function AssignmentSubmissions() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [gradingState, setGradingState] = useState<GradingState>({});
  const [editingSubmission, setEditingSubmission] = useState<string | null>(
    null
  );

  // Query hooks
  const {
    data: assignment,
    isLoading: assignmentLoading,
    isError: assignmentError,
  } = useAssignment(assignmentId!, !!assignmentId);

  const {
    data: submissions,
    isLoading: submissionsLoading,
    isError: submissionsError,
    error: submissionsErrorDetails,
  } = useSubmissionsByAssignment(
    assignmentId!,
    !!assignmentId && user?.role === "teacher"
  ) as { data: Submission[] | undefined; isLoading: boolean; isError: boolean; error: Error | null };

  const gradeSubmissionMutation = useGradeSubmissionMutation();

  // Handle grading form changes
  const handleGradingChange = (
    submissionId: string,
    field: "marks" | "feedback",
    value: string
  ) => {
    setGradingState((prev) => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value,
      },
    }));
  };

  // Start editing a submission
  const startEditing = (submission: Submission) => {
    setEditingSubmission(submission._id);
    setGradingState((prev) => ({
      ...prev,
      [submission._id]: {
        marks: submission.marks?.toString() || "",
        feedback: submission.feedback || "",
      },
    }));
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSubmission(null);
    setGradingState((prev) => {
      const newState = { ...prev };
      if (editingSubmission) {
        delete newState[editingSubmission];
      }
      return newState;
    });
  };

  // Submit grading
  const handleGradeSubmission = async (submissionId: string) => {
    const gradeData = gradingState[submissionId];
    if (!gradeData) return;

    const marks = parseInt(gradeData.marks);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      // toast.error would be handled by mutation
      return;
    }

    await gradeSubmissionMutation.mutateAsync({
      submissionId,
      assignmentId: assignmentId!,
      gradeData: {
        marks,
        feedback: gradeData.feedback,
      },
    });
    setEditingSubmission(null);
    setGradingState((prev) => {
      const newState = { ...prev };
      delete newState[submissionId];
      return newState;
    });
  };

  if (assignmentLoading || submissionsLoading) {
    return <Loading message="Loading submissions..." fullScreen />;
  }

  if (assignmentError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="Assignment Not Found"
          description="The assignment you're looking for doesn't exist or you don't have access to it."
          action={{
            label: "Go Back",
            onClick: () => navigate("/classes"),
          }}
        />
      </div>
    );
  }

  if (submissionsError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="Error Loading Submissions"
          description={
            submissionsErrorDetails?.message ||
            "Failed to load submissions for this assignment"
          }
          action={{
            label: "Try Again",
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="Assignment Not Found"
          description="The assignment you're looking for doesn't exist."
          action={{
            label: "Go Back",
            onClick: () => navigate("/classes"),
          }}
        />
      </div>
    );
  }

  const getSubmissionStats = () => {
    if (!submissions) return { total: 0, graded: 0, pending: 0 };
    const total = submissions.length;
    const graded = submissions.filter(
      (s: Submission) => s.marks !== null && s.marks !== undefined
    ).length;
    const pending = total - graded;
    return { total, graded, pending };
  };

  const stats = getSubmissionStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Assignment Header */}
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-900 dark:text-purple-100">
                    {assignment.title}
                  </h1>
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  <span className="font-medium">Submissions</span>
                  {assignment.description && (
                    <span className="block sm:inline sm:ml-2">{assignment.description}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm"
                >
                  <Users className="h-4 w-4 mr-1" />
                  {stats.total} Submissions
                </Badge>
              </div>
            </div>

            {assignment.dueDate && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-purple-600 dark:text-purple-400">
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-6 text-center bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
              {stats.total}
            </div>
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              Total Submissions
            </div>
          </Card>
          <Card className="p-4 sm:p-6 text-center bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900 dark:text-green-100">
              {stats.graded}
            </div>
            <div className="text-xs sm:text-sm text-green-700 dark:text-green-300">
              Graded
            </div>
          </Card>
          <Card className="p-4 sm:p-6 text-center bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 sm:col-span-2 lg:col-span-1">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-900 dark:text-yellow-100">
              {stats.pending}
            </div>
            <div className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
              Pending Review
            </div>
          </Card>
        </div>

        {/* Submissions List */}
        {!submissions || submissions.length === 0 ? (
          <EmptyState
            icon={<Users className="h-16 w-16 text-gray-400" />}
            title="No Submissions Yet"
            description="No students have submitted this assignment yet."
            action={{
              label: "Go Back to Assignment",
              onClick: () => navigate(`/assignments/${assignmentId}`),
            }}
          />
        ) : (
          <div className="space-y-6">
            {submissions.map((submission: Submission) => {
              const isEditing = editingSubmission === submission._id;
              const isGraded =
                submission.marks !== null && submission.marks !== undefined;
              const currentGrading = gradingState[submission._id];

              return (
                <Card key={submission._id} className="p-6">
                  <div className="space-y-4">
                    {/* Student Info */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-300 font-medium">
                              {submission.studentId?.name
                                ?.charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {submission.studentId?.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {submission.studentId?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>
                            Submitted:{" "}
                            {new Date(submission.submittedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isGraded && !isEditing && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            {submission.marks}/100
                          </Badge>
                        )}
                        {!isEditing && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(submission)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            {isGraded ? "Edit Grade" : "Grade"}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Submission Content */}
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Submission:
                      </h4>
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {submission.submissionText}
                      </p>
                    </div>

                    {/* Grading Section */}
                    {isEditing ? (
                      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 space-y-4">
                        <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                          Grade Submission
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Marks (0-100)
                            </label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Enter marks"
                              value={currentGrading?.marks || ""}
                              onChange={(e) =>
                                handleGradingChange(
                                  submission._id,
                                  "marks",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Feedback
                            </label>
                            <Textarea
                              placeholder="Enter feedback for the student"
                              value={currentGrading?.feedback || ""}
                              onChange={(e) =>
                                handleGradingChange(
                                  submission._id,
                                  "feedback",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              handleGradeSubmission(submission._id)
                            }
                            disabled={
                              gradeSubmissionMutation.isPending ||
                              !currentGrading?.marks
                            }
                            className="flex items-center gap-1"
                          >
                            {gradeSubmissionMutation.isPending ? (
                              <>
                                <LoadingSpinner className="h-4 w-4" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4" />
                                Save Grade
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={cancelEditing}
                            disabled={gradeSubmissionMutation.isPending}
                            className="flex items-center gap-1"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      isGraded && (
                        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="font-semibold text-green-900 dark:text-green-100">
                                  Graded: {submission.marks}/100
                                </span>
                              </div>
                              {submission.feedback && (
                                <div>
                                  <h5 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                                    Feedback:
                                  </h5>
                                  <p className="text-green-800 dark:text-green-200 text-sm whitespace-pre-wrap">
                                    {submission.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/assignments/${assignmentId}`)}
          >
            ← Back to Assignment
          </Button>
          <Button variant="outline" onClick={() => navigate("/classes")}>
            Back to Classes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AssignmentSubmissions;
