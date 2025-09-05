import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { useAssignment, usePrefetchClass } from "@/hooks/queries";
import {
  FileText,
  Clock,
  User,
  BookOpen,
  Edit,
  Users,
  AlertCircle,
} from "lucide-react";

const ViewAssignment = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefetchClass = usePrefetchClass();

  const {
    data: assignment,
    isLoading,
    isError,
    error,
  } = useAssignment(id!, !!id);

  // Handle class hover for prefetching
  const handleClassHover = (classId: string) => {
    prefetchClass(classId);
  };

  if (isLoading) {
    return <Loading message="Loading assignment details..." fullScreen />;
  }

  if (isError || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="Assignment Not Found"
          description={
            error?.message ||
            "The assignment you're looking for doesn't exist or you don't have access to it."
          }
          action={{
            label: "Go Back to Classes",
            onClick: () => navigate("/classes"),
          }}
        />
      </div>
    );
  }

  const isOverdue =
    assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const daysUntilDue = assignment.dueDate
    ? Math.ceil(
        (new Date(assignment.dueDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Assignment Header */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {assignment.title}
                  </h1>
                </div>

                {/* Assignment Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {assignment.createdBy && (
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <User className="h-4 w-4" />
                      <span>Created by: {assignment.createdBy.name}</span>
                    </div>
                  )}
                  {assignment.classId && (
                    <div
                      className="flex items-center gap-2 text-blue-700 dark:text-blue-300 cursor-pointer hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                      onClick={() => navigate(`/classes/${assignment.classId}`)}
                      onMouseEnter={() => handleClassHover(assignment.classId)}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>View Class</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {isOverdue ? (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    Overdue
                  </Badge>
                ) : assignment.dueDate ? (
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 ${
                      daysUntilDue !== null && daysUntilDue <= 3
                        ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                        : "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {daysUntilDue === 0
                      ? "Due Today"
                      : daysUntilDue === 1
                        ? "Due Tomorrow"
                        : daysUntilDue !== null && daysUntilDue > 0
                          ? `${daysUntilDue} Days Left`
                          : "Active"}
                  </Badge>
                ) : (
                  <Badge variant="secondary">No Due Date</Badge>
                )}
              </div>
            </div>

            {/* Due Date */}
            {assignment.dueDate && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-medium">
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Assignment Description */}
        {assignment.description && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Assignment Description
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {assignment.description}
              </p>
            </div>
          </Card>
        )}

        {/* Due Date Warning for Students */}
        {user?.role === "student" && assignment.dueDate && (
          <Card
            className={`p-4 ${
              isOverdue
                ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                : daysUntilDue !== null && daysUntilDue <= 3
                  ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                  : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {isOverdue ? (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              ) : (
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
              <div>
                <p
                  className={`font-medium ${
                    isOverdue
                      ? "text-red-800 dark:text-red-200"
                      : "text-blue-800 dark:text-blue-200"
                  }`}
                >
                  {isOverdue
                    ? "This assignment is overdue. Submissions are closed."
                    : daysUntilDue === 0
                      ? "This assignment is due today!"
                      : daysUntilDue === 1
                        ? "This assignment is due tomorrow."
                        : `You have ${daysUntilDue} days to complete this assignment.`}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Student Actions */}
            {user?.role === "student" && (
              <>
                <Button
                  onClick={() => navigate(`/assignments/${id}/submit`)}
                  disabled={!!isOverdue}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <FileText className="h-4 w-4" />
                  {isOverdue ? "Submission Closed" : "Submit Assignment"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/assignments/${id}/my-submission`)}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <Edit className="h-4 w-4" />
                  View My Submission
                </Button>
              </>
            )}

            {/* Teacher Actions */}
            {user?.role === "teacher" && (
              <>
                <Button
                  onClick={() => navigate(`/assignments/${id}/submissions`)}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <Users className="h-4 w-4" />
                  View Submissions
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate("/assignments/create", {
                      state: {
                        classId: assignment.classId,
                        editId: assignment._id,
                      },
                    })
                  }
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <Edit className="h-4 w-4" />
                  Edit Assignment
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Assignment Stats for Teachers */}
        {user?.role === "teacher" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Assignment Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  -
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Total Submissions
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  -
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Graded
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  -
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  Pending Review
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Click "View Submissions" to see detailed statistics
            </p>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/classes/${assignment.classId}`)}
            className="flex items-center gap-2"
          >
            ← Back to Class
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/classes")}
            className="flex items-center gap-2"
          >
            All Classes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewAssignment;
