import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/Loading";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { useAssignment, useUpdateAssignmentMutation } from "@/hooks/queries";
import { updateAssignmentSchema } from "@/lib/validation";
import { ArrowLeft } from "lucide-react";

type FormData = z.infer<typeof updateAssignmentSchema>;

function EditAssignment() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  // Query hooks
  const {
    data: assignment,
    isLoading: assignmentLoading,
    isError: assignmentError,
  } = useAssignment(assignmentId!, !!assignmentId);

  const updateAssignmentMutation = useUpdateAssignmentMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateAssignmentSchema),
  });

  useEffect(() => {
    if (assignment) {
      setValue("title", assignment.title);
      setValue("description", assignment.description || "");
      setValue("dueDate", assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : "");
    }
  }, [assignment, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!assignmentId) return;

    await updateAssignmentMutation.mutateAsync({
      assignmentId,
      ...data,
    });
    navigate(`/classes/${assignment?.classId}/assignments/teacher`);
  };

  // Loading state for assignment
  if (assignmentLoading) {
    return <Loading message="Loading assignment..." fullScreen />;
  }

  // Error state for assignment
  if (assignmentError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-10 px-4">
        <EmptyState
          title="Error Loading Assignment"
          description="Failed to load the assignment. Please try again."
          action={{
            label: "Go Back",
            onClick: () => navigate(-1),
          }}
        />
      </div>
    );
  }

  // Assignment not found
  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-10 px-4">
        <EmptyState
          title="Assignment Not Found"
          description="The assignment you're looking for doesn't exist or you don't have access to it."
          action={{
            label: "Go Back",
            onClick: () => navigate(-1),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white dark:bg-zinc-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-2">
          Edit Assignment
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Update the assignment details below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Assignment Title
            </label>
            <Input
              id="title"
              placeholder="Enter assignment title"
              {...register("title")}
              aria-invalid={errors.title ? "true" : "false"}
              className="text-base"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description (Optional)
            </label>
            <Textarea
              id="description"
              placeholder="Enter assignment description"
              {...register("description")}
              aria-invalid={errors.description ? "true" : "false"}
              className="text-base min-h-24"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Due Date (Optional)
            </label>
            <Input
              id="dueDate"
              type="date"
              {...register("dueDate")}
              aria-invalid={errors.dueDate ? "true" : "false"}
              className="text-base"
            />
            {errors.dueDate && (
              <p className="mt-2 text-sm text-red-500">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={updateAssignmentMutation.isPending}
              size="lg"
              className="w-full sm:w-auto text-base font-semibold"
            >
              {updateAssignmentMutation.isPending ? (
                <>
                  <LoadingSpinner className="h-5 w-5 text-white mr-2" />
                  Updating...
                </>
              ) : (
                "Update Assignment"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              size="lg"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAssignment;