import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClassSchema, type CreateClassFormData } from "@/lib/validation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { getMessage } from "@/api/response";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/Loading";

function CreateClass() {
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
  });

  const onSubmit = async (data: CreateClassFormData) => {
    try {
      const res = await axiosInstance.post("/classes/createClass", data);
      toast.success(getMessage(res) || "Class created successfully!");
      
      navigate("/classes");
    } catch (err: unknown) {
      const errorMessage = 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).response?.data?.message || 
        (err as Error).message || 
        "Failed to create class. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-10 px-2">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-2">
          Create New Class
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Fill in the details below to create a new class.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Class Name
            </label>
            <Input
              id="title"
              placeholder="Enter class name"
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
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Enter subject"
              {...register("subject")}
              aria-invalid={errors.subject ? "true" : "false"}
            />
            {errors.subject && (
              <p className="mt-2 text-sm text-red-500">
                {errors.subject.message}
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="h-5 w-5 text-white mr-2" />
                Creating...
              </>
            ) : (
              "Create Class"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateClass;
