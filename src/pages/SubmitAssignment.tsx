import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  submissionText: z.string().min(10, "Minimum 10 characters"),
});

type FormData = z.infer<typeof schema>;

function SubmitAssignment() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/submissions/submitAssignment",
        {
          assignmentId,
          submissionText: data.submissionText,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.data.accessToken}`,
          },
        }
      );

      toast("Submission successful!");
      navigate("/classes");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4">Submit Assignment</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Textarea
            placeholder="Enter your submission here"
            {...register("submissionText")}
          />
          {errors.submissionText && (
            <p className="text-red-500 text-sm">
              {errors.submissionText.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}

export default SubmitAssignment;
