import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const createClassSchema = z.object({
  title: z.string().min(2, "Class name is required"),
  subject: z.string().min(2, "Subject is required"),
});

type CreateClassForm = z.infer<typeof createClassSchema>;

function CreateClass() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClassForm>({
    resolver: zodResolver(createClassSchema),
  });

  const onSubmit = async (data: CreateClassForm) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/classes/createClass",
        data,
        {
          headers: { Authorization: `Bearer ${user?.data.accessToken}` },
        }
      );

      toast(res.data);
      navigate("/classes");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err.response?.data?.message || "Class creation failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-4 border rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Create New Class</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Class Name" {...register("title")} />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div>
          <Input placeholder="Subject" {...register("subject")} />
          {errors.subject && (
            <p className="text-red-500 text-sm">{errors.subject.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating..." : "Create Class"}
        </Button>
      </form>
    </div>
  );
}

export default CreateClass;
