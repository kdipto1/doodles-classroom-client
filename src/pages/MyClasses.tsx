import { useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { useApi } from "@/hooks/useApi";
import type { Class } from "@/lib/validation";
import { classSchema } from "@/lib/validation";
import { BookOpen } from "lucide-react";
import { z } from "zod";
import { getData, getMessage } from "@/api/response";

const classesArraySchema = z.array(classSchema);

function MyClasses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: classes,
    loading,
    execute: fetchClasses,
  } = useApi<Class[]>({
    responseSchema: classesArraySchema,
  });

  useEffect(() => {
    fetchClasses(async () => {
      const res = await axiosInstance.get("/classes/my");
      return { data: getData<Class[]>(res), message: getMessage(res) || 'Classes retrieved successfully' };
    });
  }, [fetchClasses]);

  if (loading) {
    return <Loading message="Loading your classes..." fullScreen />;
  }

  if (!classes || classes.length === 0) {
    const actionLabel =
      user?.role === "teacher" ? "Create Class" : "Join Class";
    const actionPath =
      user?.role === "teacher" ? "/classes/create" : "/classes/join";

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-4 flex items-center justify-center">
        <EmptyState
          icon={<BookOpen className="h-8 w-8 text-gray-400" />}
          title="No classes found"
          description={
            user?.role === "teacher"
              ? "You haven't created any classes yet. Create your first class to get started."
              : "You haven't joined any classes yet. Join a class using a class code to get started."
          }
          action={{
            label: actionLabel,
            onClick: () => navigate(actionPath),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-8">
          My Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {classes.map((cls) => (
            <Card
              key={cls._id}
              className="p-6 bg-gradient-to-br from-blue-100 to-white dark:from-blue-950 dark:to-zinc-800 border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                {cls.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                Subject: <span className="font-medium">{cls.subject}</span>
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                Teacher:{" "}
                <span className="font-medium">
                  {cls.teacher?.name || "N/A"}
                </span>{" "}
                ({cls.teacher?.email})
              </p>
              {user?.role === "teacher" && (
                <p className="text-sm mt-2 text-zinc-500 dark:text-zinc-400">
                  Class Code:{" "}
                  <span className="font-mono bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded text-blue-800 dark:text-blue-200">
                    {cls.code}
                  </span>
                </p>
              )}
              {user?.role === "student" && (
                <Button
                  onClick={() => navigate(`/classes/${cls._id}/assignments`)}
                  className="mt-4 w-full"
                >
                  Class Assignments
                </Button>
              )}
              {user?.role === "teacher" && (
                <Button
                  onClick={() =>
                    navigate(`/classes/${cls._id}/assignments/teacher`)
                  }
                  className="mt-4 w-full"
                >
                  Class Assignments
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyClasses;
