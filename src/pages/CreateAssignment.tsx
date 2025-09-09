import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/Loading";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { useMyClasses, useCreateAssignmentMutation } from "@/hooks/queries";

const schema = z.object({
  classId: z.string().min(1, "Please select a class"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function CreateAssignment() {
  const navigate = useNavigate();
  const location = useLocation();

  // Query hooks
  const {
    data: classes,
    isLoading: classesLoading,
    isError: classesError,
  } = useMyClasses();
  const createAssignmentMutation = useCreateAssignmentMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (location.state?.classId) {
      setValue("classId", location.state.classId);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data: FormData) => {
    await createAssignmentMutation.mutateAsync(data);
    navigate("/classes");
  };

  // Loading state for classes
  if (classesLoading) {
    return <Loading message="Loading classes..." fullScreen />;
  }

  // Error state for classes
  if (classesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-10 px-2">
        <EmptyState
          title="Error Loading Classes"
          description="Failed to load your classes. Please try again."
          action={{
            label: "Go Back",
            onClick: () => navigate("/classes"),
          }}
        />
      </div>
    );
  }

  // No classes available
  if (!classes || classes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-10 px-2">
        <EmptyState
          title="No Classes Found"
          description="You need to create a class before you can create assignments."
          action={{
            label: "Create Class",
            onClick: () => navigate("/classes/create"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white dark:bg-zinc-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-2">
          Create Assignment
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Fill in the details below to create a new assignment.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="classId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select Class
            </label>
            <select
              id="classId"
              {...register("classId")}
              aria-invalid={errors.classId ? "true" : "false"}
              className="w-full rounded-md border border-input bg-background px-3 py-3 text-base placeholder:text-muted-foreground text-foreground shadow-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-zinc-700 dark:border-zinc-600 min-h-[48px]"
            >
              <option value="">-- Choose a Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.title} - {cls.subject}
                </option>
              ))}
            </select>
            {errors.classId && (
              <p className="mt-2 text-sm text-red-500">
                {errors.classId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Assignment Title
            </label>
            <Input
              id="title"
              placeholder="Enter assignment title"
              {...register("title")}
              aria-invalid={errors.title ? "true" : "false"}
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
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter description"
              {...register("description")}
              aria-invalid={errors.description ? "true" : "false"}
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
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              {...register("dueDate")}
              aria-invalid={errors.dueDate ? "true" : "false"}
            />
            {errors.dueDate && (
              <p className="mt-2 text-sm text-red-500">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={createAssignmentMutation.isPending}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createAssignmentMutation.isPending ? (
              <>
                <LoadingSpinner className="h-5 w-5 text-white mr-2" />
                Creating...
              </>
            ) : (
              "Create Assignment"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateAssignment;
