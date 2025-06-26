import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const joinClassSchema = z.object({
  code: z.string().min(6, "Class code is required"),
});

type JoinClassForm = z.infer<typeof joinClassSchema>;

function JoinClass() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinClassForm>({
    resolver: zodResolver(joinClassSchema),
  });

  const onSubmit = async (data: JoinClassForm) => {
    try {
      await axios.post("http://localhost:5000/api/v1/classes/join", data, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });

      toast("Successfully joined the class!");
      navigate("/classes");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to join class");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-2">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Join a Class
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your class code below to join a class.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="classCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Class Code
            </label>
            <Input
              id="classCode"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter class code"
              {...register("code")}
            />
            {errors.code && (
              <p className="mt-2 text-sm text-red-600">{errors.code.message}</p>
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
                Joining...
              </>
            ) : (
              "Join Class"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default JoinClass;
