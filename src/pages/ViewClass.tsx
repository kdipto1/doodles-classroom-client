import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import axios from 'axios';
import { getData } from '@/api/response';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface IClassroom {
  _id: string;
  title: string;
  subject?: string;
  description?: string;
  code: string;
  teacher: { _id: string; name: string; email: string };
  students: { _id: string; name: string; email: string }[];
}

interface IAssignment {
  _id: string;
  title: string;
  dueDate?: string;
}

const ViewClass = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [classroom, setClassroom] = useState<IClassroom | null>(null);
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const classResponse = await axiosInstance.get(`/classes/${id}`);
        setClassroom(getData<IClassroom>(classResponse));

        const assignmentsResponse = await axiosInstance.get(`/assignments/class/${id}`);
        const data = getData<IAssignment[]>(assignmentsResponse);
        setAssignments(Array.isArray(data) ? data : []);

      } catch (err: unknown) {
        console.error('Error fetching class details:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load class details.');
        } else {
          setError('An unexpected error occurred.');
        }
        toast.error(error || 'Failed to load class details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, error]);

  if (loading) {
    return <div className="text-center py-8">Loading class details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!classroom) {
    return <div className="text-center py-8">Class not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{classroom.title}</CardTitle>
          <p className="text-gray-600">Subject: {classroom.subject || 'N/A'}</p>
          <p className="text-gray-600">Teacher: {classroom.teacher.name} ({classroom.teacher.email})</p>
          <Badge className="mt-2">Class Code: {classroom.code}</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">{classroom.description || 'No description provided.'}</p>

          <h3 className="text-2xl font-semibold mb-3">Students ({classroom.students.length})</h3>
          {classroom.students.length > 0 ? (
            <ul className="list-disc pl-5 mb-6">
              {classroom.students.map((student) => (
                <li key={student._id} className="text-gray-700">{student.name} ({student.email})</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mb-6">No students enrolled yet.</p>
          )}

          <h3 className="text-2xl font-semibold mb-3">Assignments</h3>
          {user?.role === 'teacher' && (
            <Button asChild className="mb-4">
              <Link to="/create-assignment" state={{ classId: classroom._id, title: classroom.title }}>Create New Assignment</Link>
            </Button>
          )}
          
          {assignments.length > 0 ? (
            <ul className="list-disc pl-5">
              {assignments.map((assignment) => (
                <li key={assignment._id}>
                  <Link to={`/assignments/${assignment._id}`}>{assignment.title} (Due: {new Date(assignment.dueDate || '').toLocaleDateString()})</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No assignments for this class yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewClass;
