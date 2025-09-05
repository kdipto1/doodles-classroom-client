import type { Assignment } from "@/lib/validation";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import {
  useAssignmentsByClass,
  useClass,
  usePrefetchAssignment,
} from "@/hooks/queries";
import {
  FileText,
  Clock,
  Users,
  Plus,
  Eye,
  Edit,
  BookOpen,
} from "lucide-react";

function TeacherAssignments() {
  const { classId } = useParams<{ classId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefetchAssignment = usePrefetchAssignment();

  // Query hooks
  const {
    data: classData,
    isLoading: classLoading,
    isError: classError,
  } = useClass(classId!, !!classId && user?.role === "teacher");

  const {
    data: assignments,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
    error: assignmentsErrorDetails,
  } = useAssignmentsByClass(classId!, !!classId && user?.role === "teacher");

  // Handle assignment hover for prefetching
  const handleAssignmentHover = (assignmentId: string) => {
    prefetchAssignment(assignmentId);
  };

  if (classLoading || assignmentsLoading) {
    return <Loading message="Loading assignments..." fullScreen />;
  }

  if (classError || assignmentsError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="Error Loading Data"
          description={
            assignmentsErrorDetails?.message ||
            "Failed to load class or assignments"
          }
          action={{
            label: "Go Back to Classes",
            onClick: () => navigate("/classes"),
          }}
        />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="Class Not Found"
          description="The class you're looking for doesn't exist or you don't have access to it."
          action={{
            label: "Go Back to Classes",
            onClick: () => navigate("/classes"),
          }}
        />
      </div>
    );
  }

  const getAssignmentStats = (assignment: Assignment) => {
    // You could add submission counts here when that data is available
    return {
      isOverdue:
        assignment.dueDate && new Date(assignment.dueDate) < new Date(),
      daysUntilDue: assignment.dueDate
        ? Math.ceil(
            (new Date(assignment.dueDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Class Header */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {classData.title} - Assignments
                </h1>
              </div>
              <p className="text-purple-700 dark:text-purple-300">
                Subject: {classData.subject}
              </p>
              {classData.description && (
                <p className="text-purple-600 dark:text-purple-400 text-sm">
                  {classData.description}
                </p>
              )}
            </div>
            <Button
              onClick={() =>
                navigate("/assignments/create", {
                  state: { classId: classData._id, title: classData.title },
                })
              }
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Assignment
            </Button>
          </div>
        </Card>

        {/* Assignments List */}
        {!assignments || assignments.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-16 w-16 text-gray-400" />}
            title="No Assignments Yet"
            description="You haven't created any assignments for this class yet."
            action={{
              label: "Create First Assignment",
              onClick: () =>
                navigate("/assignments/create", {
                  state: { classId: classData._id, title: classData.title },
                }),
            }}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Assignments ({assignments.length})
              </h2>
            </div>

            <div className="grid gap-6">
              {assignments.map((assignment: Assignment) => {
                const stats = getAssignmentStats(assignment);

                return (
                  <Card
                    key={assignment._id}
                    className="p-6 hover:shadow-lg transition-all duration-200"
                    onMouseEnter={() => handleAssignmentHover(assignment._id)}
                  >
                    <div className="space-y-4">
                      {/* Assignment Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                              {assignment.title}
                            </h3>
                          </div>
                          {assignment.description && (
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {assignment.description}
                            </p>
                          )}
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2">
                          {stats.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                          {!stats.isOverdue &&
                            stats.daysUntilDue !== null &&
                            stats.daysUntilDue <= 7 && (
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs"
                              >
                                Due Soon
                              </Badge>
                            )}
                        </div>
                      </div>

                      {/* Assignment Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {assignment.dueDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Due:{" "}
                              {new Date(assignment.dueDate).toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            Students: {classData.students?.length || 0}
                          </span>
                        </div>
                      </div>

                      {/* Due Date Information */}
                      {assignment.dueDate && (
                        <div className="text-sm">
                          {stats.isOverdue ? (
                            <span className="text-red-600 dark:text-red-400">
                              Overdue by{" "}
                              {Math.abs(stats.daysUntilDue || 0) === 1
                                ? "1 day"
                                : `${Math.abs(stats.daysUntilDue || 0)} days`}
                            </span>
                          ) : stats.daysUntilDue !== null ? (
                            <span className="text-gray-600 dark:text-gray-400">
                              {stats.daysUntilDue === 0
                                ? "Due today"
                                : stats.daysUntilDue === 1
                                ? "Due tomorrow"
                                : `${stats.daysUntilDue} days remaining`}
                            </span>
                          ) : null}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/assignments/${assignment._id}`)
                          }
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/assignments/${assignment._id}/submissions`
                            )
                          }
                          className="flex items-center gap-1"
                        >
                          <Users className="h-3 w-3" />
                          View Submissions
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            navigate("/assignments/create", {
                              state: {
                                classId: classData._id,
                                title: classData.title,
                                editId: assignment._id,
                              },
                            })
                          }
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/classes/${classId}`)}
          >
            ← Back to Class
          </Button>
          <Button variant="outline" onClick={() => navigate("/classes")}>
            All Classes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignments;
