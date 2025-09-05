import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinClassSchema, type JoinClassFormData } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useJoinClassMutation } from "@/hooks/queries";
import { LoadingSpinner } from "@/components/Loading";

function JoinClass() {
  const navigate = useNavigate();
  const joinClassMutation = useJoinClassMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinClassFormData>({
    resolver: zodResolver(joinClassSchema),
  });

  const onSubmit = async (data: JoinClassFormData) => {
    await joinClassMutation.mutateAsync(data);
    navigate("/classes");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-10 px-2">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-2">
          Join a Class
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Enter your class code below to join a class.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="classCode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Class Code
            </label>
            <Input
              id="classCode"
              placeholder="Enter class code"
              {...register("code")}
              aria-invalid={errors.code ? "true" : "false"}
              autoComplete="off"
            />
            {errors.code && (
              <p className="mt-2 text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={joinClassMutation.isPending}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {joinClassMutation.isPending ? (
              <>
                <LoadingSpinner className="h-5 w-5 text-white mr-2" />
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
