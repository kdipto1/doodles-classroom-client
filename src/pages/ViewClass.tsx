import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import {
  useClass,
  useAssignmentsByClass,
  usePrefetchAssignment,
} from "@/hooks/queries";
import { BookOpen, Users, FileText, Plus } from "lucide-react";

const ViewClass = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefetchAssignment = usePrefetchAssignment();

  const {
    data: classroom,
    isLoading: classLoading,
    isError: classError,
    error: classErrorDetails,
  } = useClass(id!, !!id);

  const {
    data: assignments,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
  } = useAssignmentsByClass(id!, !!id);

  // Handle mouse enter to prefetch assignment data
  const handleAssignmentHover = (assignmentId: string) => {
    prefetchAssignment(assignmentId);
  };

  if (classLoading || assignmentsLoading) {
    return <Loading message="Loading class details..." fullScreen />;
  }

  if (classError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="Error Loading Class"
          description={
            classErrorDetails?.message || "Failed to load class details"
          }
          action={{
            label: "Go Back to Classes",
            onClick: () => navigate("/classes"),
          }}
        />
      </div>
    );
  }

  if (!classroom) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Class Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  <BookOpen className="h-8 w-8" />
                  {classroom.title}
                </CardTitle>
                <div className="space-y-1">
                  <p className="text-blue-700 dark:text-blue-300 text-lg">
                    Subject: {classroom.subject || "N/A"}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">
                    Teacher: {classroom.teacher?.name} (
                    {classroom.teacher?.email})
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1"
              >
                Code: {classroom.code}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {classroom.description && (
              <p className="text-blue-700 dark:text-blue-300 text-lg mb-4">
                {classroom.description}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <Users className="h-6 w-6 text-green-600" />
                Students ({classroom.students?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {classroom.students && classroom.students.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {classroom.students.map((student) => (
                    <div
                      key={student._id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg"
                    >
                      <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-300 text-sm font-medium">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Users className="h-12 w-12 text-gray-400" />}
                  title="No Students Yet"
                  description="No students have joined this class yet."
                />
              )}
            </CardContent>
          </Card>

          {/* Assignments Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                  Assignments
                </CardTitle>
                {user?.role === "teacher" && (
                  <Button
                    onClick={() =>
                      navigate("/assignments/create", {
                        state: {
                          classId: classroom._id,
                          title: classroom.title,
                        },
                      })
                    }
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Create Assignment
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {assignmentsError ? (
                <EmptyState
                  title="Error Loading Assignments"
                  description="Failed to load assignments for this class"
                />
              ) : assignments && assignments.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {assignments.map((assignment) => (
                    <Link
                      key={assignment._id}
                      to={`/assignments/${assignment._id}`}
                      onMouseEnter={() => handleAssignmentHover(assignment._id)}
                      className="block p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {assignment.title}
                          </h4>
                          {assignment.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {assignment.description}
                            </p>
                          )}
                        </div>
                        {assignment.dueDate && (
                          <Badge variant="outline" className="text-xs">
                            Due:{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<FileText className="h-12 w-12 text-gray-400" />}
                  title="No Assignments Yet"
                  description="No assignments have been created for this class yet."
                  action={
                    user?.role === "teacher"
                      ? {
                          label: "Create First Assignment",
                          onClick: () =>
                            navigate("/assignments/create", {
                              state: {
                                classId: classroom._id,
                                title: classroom.title,
                              },
                            }),
                        }
                      : undefined
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/classes")}
            className="flex items-center gap-2"
          >
            ← Back to Classes
          </Button>
          {user?.role === "student" && (
            <Button
              onClick={() => navigate(`/classes/${id}/assignments`)}
              className="flex items-center gap-2"
            >
              View My Assignments
              <FileText className="h-4 w-4" />
            </Button>
          )}
          {user?.role === "teacher" && (
            <Button
              onClick={() => navigate(`/classes/${id}/assignments/teacher`)}
              className="flex items-center gap-2"
            >
              Manage Assignments
              <FileText className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewClass;
