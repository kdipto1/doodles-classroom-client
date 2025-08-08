import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import axios from "axios";
import { getData } from "@/api/response";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";

interface IAssignment {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  classId: string;
  createdBy: { _id: string; name: string };
}

const ViewAssignment = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<IAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/assignments/${id}`);
        setAssignment(getData<IAssignment>(response));
      } catch (err: unknown) {
        console.error("Error fetching assignment details:", err);
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to load assignment details."
          );
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssignmentDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-8">Loading assignment details...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!assignment) {
    return <div className="text-center py-8">Assignment not found.</div>;
  }

  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {assignment.title}
          </CardTitle>
          <p className="text-gray-600">
            Created by: {assignment.createdBy.name}
          </p>
          {assignment.dueDate && (
            <Badge className="mt-2">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            {assignment.description || "No description provided."}
          </p>

          <div className="flex space-x-4 mt-4">
            {isStudent && (
              <Button asChild>
                <Link to={`/assignments/${assignment._id}/submit`}>
                  Submit Assignment
                </Link>
              </Button>
            )}
            {isStudent && (
              <Button asChild variant="outline">
                <Link to={`/assignments/${assignment._id}/my-submission`}>
                  View My Submission
                </Link>
              </Button>
            )}
            {isTeacher && (
              <Button asChild>
                <Link to={`/assignments/${assignment._id}/submissions`}>
                  View All Submissions
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewAssignment;
