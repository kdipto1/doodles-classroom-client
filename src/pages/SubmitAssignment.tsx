import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/Loading";
import {
  useAssignment,
  useMySubmission,
  useSubmitAssignmentMutation,
} from "@/hooks/queries";
import { FileText, Clock, AlertCircle } from "lucide-react";

const schema = z.object({
  submissionText: z.string().min(1, "Submission text is required"),
});

type FormData = z.infer<typeof schema>;

function SubmitAssignment() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  // Query hooks
  const {
    data: assignment,
    isLoading: assignmentLoading,
    isError: assignmentError,
  } = useAssignment(assignmentId!, !!assignmentId);

  const { data: existingSubmission, isLoading: submissionLoading } =
    useMySubmission(assignmentId!, !!assignmentId);

  const submitAssignmentMutation = useSubmitAssignmentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!assignmentId) return;

    await submitAssignmentMutation.mutateAsync({
      assignmentId,
      submissionText: data.submissionText,
    });

    navigate(`/assignments/${assignmentId}/my-submission`);
  };

  if (assignmentLoading || submissionLoading) {
    return <Loading message="Loading assignment details..." fullScreen />;
  }

  if (assignmentError || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="Assignment Not Found"
          description="The assignment you're looking for doesn't exist or you don't have access to it."
          action={{
            label: "Go Back to Classes",
            onClick: () => navigate("/classes"),
          }}
        />
      </div>
    );
  }

  // Check if assignment is overdue
  const isOverdue =
    assignment.dueDate && new Date(assignment.dueDate) < new Date();

  // Check if already submitted
  if (existingSubmission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          title="Already Submitted"
          description="You have already submitted this assignment. You can view your submission below."
          action={{
            label: "View My Submission",
            onClick: () =>
              navigate(`/assignments/${assignmentId}/my-submission`),
          }}
        />
      </div>
    );
  }

  // Check if overdue
  if (isOverdue) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          icon={<AlertCircle className="h-16 w-16 text-red-400" />}
          title="Submission Closed"
          description="The deadline for this assignment has passed. You can no longer submit."
          action={{
            label: "View Assignment Details",
            onClick: () => navigate(`/assignments/${assignmentId}`),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Assignment Header */}
        <Card className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {assignment.title}
              </h1>
            </div>

            {assignment.description && (
              <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                {assignment.description}
              </p>
            )}

            {assignment.dueDate && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-blue-600 dark:text-blue-400">
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Submission Form */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Submit Your Assignment
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please provide your submission below. Make sure to review your
              work before submitting.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="submissionText"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Submission Content *
              </label>
              <Textarea
                id="submissionText"
                placeholder="Enter your assignment submission here..."
                {...register("submissionText")}
                aria-invalid={errors.submissionText ? "true" : "false"}
                className="min-h-[200px] resize-y"
              />
              {errors.submissionText && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.submissionText.message}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Provide detailed information about your assignment solution.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitAssignmentMutation.isPending}
                className="flex-1 sm:flex-none min-w-[150px] flex items-center justify-center gap-2"
              >
                {submitAssignmentMutation.isPending ? (
                  <>
                    <LoadingSpinner className="h-4 w-4" />
                    Submitting...
                  </>
                ) : (
                  "Submit Assignment"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/assignments/${assignmentId}`)}
                className="flex-1 sm:flex-none"
              >
                View Assignment Details
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/classes")}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Important Notes */}
        <Card className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Important Notes:
              </h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                <li>You can only submit once. Review your work carefully.</li>
                <li>Late submissions are not accepted after the due date.</li>
                <li>
                  Make sure your submission is complete and addresses all
                  requirements.
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SubmitAssignment;
