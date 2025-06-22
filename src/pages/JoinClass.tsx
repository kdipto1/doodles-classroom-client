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
  classCode: z.string().min(6, "Class code is required"),
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
        headers: { Authorization: `Bearer ${user?.data.accessToken}` },
      });

      toast("Successfully joined the class!");
      navigate("/classes");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to join class");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-4 border rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Join a Class</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Enter Class Code" {...register("classCode")} />
          {errors.classCode && (
            <p className="text-red-500 text-sm">{errors.classCode.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Joining..." : "Join Class"}
        </Button>
      </form>
    </div>
  );
}

export default JoinClass;
