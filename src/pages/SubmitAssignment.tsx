import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";

import axiosInstance from "../api/axios";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  submissionText: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function SubmitAssignment() {
  const { assignmentId } = useParams();
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await axiosInstance.post(
        "/submissions/submitAssignment",
        {
          assignmentId,
          submissionText: data.submissionText,
        },
      );

      toast("Submission successful!");
      navigate("/classes");
      } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Submission failed", {
          position: "top-center",
        });
      } else {
        toast.error("An unexpected error occurred during submission.", {
          position: "top-center",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-10 px-2">
      <div className="max-w-lg w-full bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-2">
          Submit Assignment
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Enter your answer below and submit your assignment.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="submissionText"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Your Submission
            </label>
            <Textarea
              id="submissionText"
              placeholder="Enter your submission here"
              {...register("submissionText")}
            />
            {errors.submissionText && (
              <p className="mt-2 text-sm text-red-600">
                {errors.submissionText.message}
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
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SubmitAssignment;
