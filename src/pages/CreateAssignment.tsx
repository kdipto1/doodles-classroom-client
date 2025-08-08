import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "../api/axios";
import { getData } from "@/api/response";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/Loading";

const schema = z.object({
  classId: z.string().min(1, "Please select a class"),
  title: z.string().min(2),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function CreateAssignment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [classes, setClasses] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state?.classId) {
      setValue("classId", location.state.classId);
    }
  }, [location.state, setValue]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axiosInstance.get("/classes/my");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = getData<any[]>(res);
        setClasses(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message || "Failed to load classes");
        } else {
          toast.error("An unexpected error occurred while loading classes.");
        }
      }
    };

    if (user?.role === "teacher") {
      fetchClasses();
    }
  }, [user]);

  const onSubmit = async (data: FormData) => {
    try {
      await axiosInstance.post("/assignments/createAssignment", data);
      toast("Assignment created!");
      navigate("/classes");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Failed to create assignment"
        );
      } else {
        toast.error("An unexpected error occurred while creating assignment.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-10 px-2">
      <div className="max-w-lg w-full bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700">
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
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Select Class
            </label>
            <select
              id="classId"
              {...register("classId")}
              aria-invalid={errors.classId ? "true" : "false"}
              className="w-full mt-1 rounded-md border border-input bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30"
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
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">
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
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">
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
            />
            {errors.dueDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.dueDate.message}
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
              "Create Assignment"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateAssignment;
