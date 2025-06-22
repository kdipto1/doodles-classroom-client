import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const schema = z.object({
  classId: z.string().min(1, "Please select a class"),
  title: z.string().min(2),
  instructions: z.string().min(5),
  dueDate: z.string().min(5),
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
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/classes/my", {
          headers: {
            Authorization: `Bearer ${user?.data.accessToken}`,
          },
        });
        setClasses(res.data || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("Failed to load classes");
      }
    };

    if (user?.data.role === "teacher") {
      fetchClasses();
    }
  }, [user]);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/assignments/createAssignment",
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.data.accessToken}`,
          },
        }
      );
      toast("Assignment created!");
      navigate("/classes");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to create assignment");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Create Assignment</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Select Class</label>
          <select
            {...register("classId")}
            className="w-full p-2 mt-1 border rounded"
          >
            <option value="">-- Choose a Class --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.subject}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="text-red-500 text-sm">{errors.classId.message}</p>
          )}
        </div>

        <div>
          <Input placeholder="Assignment Title" {...register("title")} />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Textarea placeholder="Instructions" {...register("instructions")} />
          {errors.instructions && (
            <p className="text-red-500 text-sm">
              {errors.instructions.message}
            </p>
          )}
        </div>

        <div>
          <Input type="date" {...register("dueDate")} />
          {errors.dueDate && (
            <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating..." : "Create Assignment"}
        </Button>
      </form>
    </div>
  );
}

export default CreateAssignment;
