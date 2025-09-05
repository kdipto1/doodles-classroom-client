import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { useAssignmentsByClass, usePrefetchAssignment } from "@/hooks/queries";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

function ClassAssignments() {
  const { classId } = useParams<{ classId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefetchAssignment = usePrefetchAssignment();

  const {
    data: assignments,
    isLoading,
    isError,
    error,
  } = useAssignmentsByClass(
    classId || "",
    !!classId && user?.role === "student"
  );

  // Handle mouse enter to prefetch assignment data
  const handleAssignmentHover = (assignmentId: string) => {
    prefetchAssignment(assignmentId);
  };

  if (isLoading) {
    return <Loading message="Loading assignments..." fullScreen />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="Error Loading Assignments"
          description={error?.message || "Failed to load assignments"}
          action={{
            label: "Go Back to Classes",
            onClick: () => navigate("/classes"),
          }}
        />
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          icon={<FileText className="h-16 w-16 text-gray-400" />}
          title="No Assignments Found"
          description="This class doesn't have any assignments yet."
          action={{
            label: "Go Back to Classes",
            onClick: () => navigate("/classes"),
          }}
        />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSubmissionStatus = (assignment: any) => {
    if (assignment.mySubmission) {
      if (assignment.mySubmission.marks !== undefined) {
        return {
          status: "graded",
          label: "Graded",
          icon: <CheckCircle className="h-4 w-4" />,
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        };
      }
      return {
        status: "submitted",
        label: "Submitted",
        icon: <CheckCircle className="h-4 w-4" />,
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      };
    }

    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isOverdue = dueDate < now;

    return {
      status: "pending",
      label: isOverdue ? "Overdue" : "Not Submitted",
      icon: isOverdue ? (
        <XCircle className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      ),
      className: isOverdue
        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
  };

  const isAssignmentOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-2">
            Class Assignments
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your assignments and track your progress
          </p>
        </div>

        <div className="space-y-6">
          {assignments.map((assignment) => {
            const submissionStatus = getSubmissionStatus(assignment);
            const isOverdue = assignment.dueDate
              ? isAssignmentOverdue(assignment.dueDate)
              : false;

            return (
              <Card
                key={assignment._id}
                className="p-6 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-all duration-200"
                onMouseEnter={() => handleAssignmentHover(assignment._id)}
              >
                <div className="space-y-4">
                  {/* Assignment Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {assignment.title}
                        </h3>
                      </div>
                      {assignment.description && (
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {assignment.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${submissionStatus.className} flex items-center gap-1`}
                    >
                      {submissionStatus.icon}
                      {submissionStatus.label}
                    </Badge>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Due:{" "}
                      {assignment.dueDate
                        ? new Date(assignment.dueDate).toLocaleString()
                        : "No due date"}
                    </span>
                    {isOverdue && !assignment.mySubmission && (
                      <Badge variant="destructive" className="ml-2">
                        Overdue
                      </Badge>
                    )}
                  </div>

                  {/* Submission Info */}
                  {assignment.mySubmission && (
                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Submitted on:{" "}
                          {new Date(
                            assignment.mySubmission.submittedAt
                          ).toLocaleString()}
                        </span>
                      </div>
                      {assignment.mySubmission.marks !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-green-900"
                          >
                            Grade: {assignment.mySubmission.marks}/100
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      disabled={!!assignment.mySubmission || isOverdue}
                      className="flex-1 sm:flex-none"
                      onClick={() =>
                        navigate(`/assignments/${assignment._id}/submit`)
                      }
                    >
                      {assignment.mySubmission
                        ? "Already Submitted"
                        : isOverdue
                        ? "Submission Closed"
                        : "Submit Assignment"}
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() =>
                        navigate(`/assignments/${assignment._id}/my-submission`)
                      }
                    >
                      View My Submission
                    </Button>

                    <Button
                      variant="ghost"
                      className="flex-1 sm:flex-none"
                      onClick={() => navigate(`/assignments/${assignment._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
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

export default ClassAssignments;
