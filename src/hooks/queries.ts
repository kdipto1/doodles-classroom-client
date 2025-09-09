import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import { getData } from "@/api/response";
import { queryKeys, invalidationKeys } from "./queryKeys";
import type {
  LoginFormData,
  RegisterFormData,
  CreateClassFormData,
  JoinClassFormData,
  Submission,
  User,
  Class,
  Assignment,
  LoginData,
} from "@/lib/validation";
import { AxiosError } from "axios";

// ============================================================================
// AUTH QUERIES
// ============================================================================

export const useMe = () => {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return getData(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useToastMutation<LoginData, Error, LoginFormData>({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await axiosInstance.post("/auth/login", credentials);
      return getData(response) as LoginData;
    },
    successMessage: "Login successful!",
    errorMessage: "Login failed",
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
    onError: () => {
      // Additional error handling if needed, otherwise can be removed
    },
  });
};

export const useRegisterMutation = () => {
  return useToastMutation<User, Error, RegisterFormData>({
    mutationFn: async (userData: RegisterFormData) => {
      const response = await axiosInstance.post("/auth/register", userData);
      return getData(response) as User;
    },
    successMessage: "Registration successful!",
    errorMessage: "Registration failed",
  });
};

// ============================================================================
// CLASS QUERIES
// ============================================================================

export const useMyClasses = () => {
  return useQuery<Class[]>({
    // Explicitly type return
    queryKey: queryKeys.classes.myClasses(),
    queryFn: async () => {
      const response = await axiosInstance.get("/classes/my");
      return getData(response) as Class[]; // Explicitly cast return type
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useClass = (id: string, enabled = true) => {
  return useQuery<Class>({
    // Explicitly type return
    queryKey: queryKeys.classes.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(`/classes/${id}`);
      return getData(response) as Class; // Explicitly cast return type
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateClassMutation = () => {
  const queryClient = useQueryClient();

  return useToastMutation<Class, Error, CreateClassFormData>({
    mutationFn: async (classData: CreateClassFormData) => {
      const response = await axiosInstance.post(
        "/classes/createClass",
        classData
      );
      return getData(response) as Class;
    },
    successMessage: "Class created successfully!",
    errorMessage: "Failed to create class",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_data) => {
      // Invalidate classes list to show the new class
      queryClient.invalidateQueries({
        queryKey: invalidationKeys.classes.all(),
      });
    },
  });
};

export const useJoinClassMutation = () => {
  const queryClient = useQueryClient();

  return useToastMutation<Class, Error, JoinClassFormData>({
    mutationFn: async (joinData: JoinClassFormData) => {
      const response = await axiosInstance.post("/classes/join", joinData);
      return getData(response) as Class;
    },
    successMessage: "Successfully joined class!",
    errorMessage: "Failed to join class",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_data) => {
      // Invalidate classes list to show the new class
      queryClient.invalidateQueries({
        queryKey: invalidationKeys.classes.all(),
      });
    },
  });
};

// ============================================================================
// ASSIGNMENT QUERIES
// ============================================================================

export const useAssignmentsByClass = (classId: string, enabled = true) => {
  return useQuery<Assignment[]>({
    // Explicitly type return
    queryKey: queryKeys.assignments.byClass(classId),
    queryFn: async () => {
      const response = await axiosInstance.get(`/assignments/class/${classId}`);
      return getData(response) as Assignment[]; // Explicitly cast return type
    },
    enabled: enabled && !!classId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAssignment = (id: string, enabled = true) => {
  return useQuery<Assignment>({
    // Explicitly type return
    queryKey: queryKeys.assignments.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(`/assignments/${id}`);
      return getData(response) as Assignment; // Explicitly cast return type
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

interface CreateAssignmentData {
  classId: string;
  title: string;
  description?: string;
  dueDate?: string;
}

export const useCreateAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useToastMutation<Assignment, Error, CreateAssignmentData>({
    mutationFn: async (assignmentData) => {
      const response = await axiosInstance.post(
        "/assignments/createAssignment",
        assignmentData
      );
      return getData<Assignment>(response);
    },
    successMessage: "Assignment created successfully!",
    errorMessage: "Failed to create assignment",
    onSuccess: (_data, variables) => {
      // Invalidate assignments for this class
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignments.byClass(variables.classId),
      });
      // Also invalidate dashboard stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.stats(),
      });
    },
  });
};

interface UpdateAssignmentData {
  assignmentId: string;
  title: string;
  description?: string;
  dueDate?: string;
}

export const useUpdateAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useToastMutation<Assignment, Error, UpdateAssignmentData>({
    mutationFn: async ({ assignmentId, ...assignmentData }) => {
      const response = await axiosInstance.patch(
        `/assignments/${assignmentId}`,
        assignmentData
      );
      return getData<Assignment>(response);
    },
    successMessage: "Assignment updated successfully!",
    errorMessage: "Failed to update assignment",
    onSuccess: (_data, variables) => {
      // Invalidate the specific assignment
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignments.detail(variables.assignmentId),
      });
      // Invalidate all assignments to refresh lists
      queryClient.invalidateQueries({
        queryKey: invalidationKeys.assignments.all(),
      });
      // Also invalidate dashboard stats
      queryClient.invalidateQueries({
        queryKey: invalidationKeys.dashboard.all(),
      });
    },
  });
};

// ============================================================================
// SUBMISSION QUERIES
// ============================================================================

export const useSubmissionsByAssignment = (
  assignmentId: string,
  enabled = true
) => {
  return useQuery<Submission[]>({
    // Explicitly type return
    queryKey: queryKeys.submissions.byAssignment(assignmentId),
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/submissions/assignment/${assignmentId}`
      );
      return getData(response) as Submission[]; // Explicitly cast return type
    },
    enabled: enabled && !!assignmentId,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useMySubmission = (assignmentId: string, enabled = true) => {
  return useQuery<Submission | null>({
    queryKey: queryKeys.submissions.mySubmission(assignmentId),
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/submissions/my/${assignmentId}`
      );
      if (response.data && Object.keys(response.data).length > 0) {
        return getData(response) as Submission;
      }
      return null;
    },
    enabled: enabled && !!assignmentId,
    staleTime: 1000 * 60, // 1 minute
    retry: (failureCount, error) => {
      // Don't retry if it's a 404 (no submission exists)
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useSubmitAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useToastMutation<
    Submission,
    Error,
    { assignmentId: string; submissionText?: string; submissionFile?: string }
  >({
    // Explicitly type TData, TError, TVariables
    mutationFn: async (submissionData: {
      assignmentId: string;
      submissionText?: string;
      submissionFile?: string;
    }) => {
      const response = await axiosInstance.post(
        "/submissions/submitAssignment",
        submissionData
      );
      return getData(response) as Submission; // Explicitly cast return type
    },
    successMessage: "Assignment submitted successfully!",
    errorMessage: "Failed to submit assignment",
    onSuccess: (_data, variables) => {
      // Invalidate my submission for this assignment
      queryClient.invalidateQueries({
        queryKey: queryKeys.submissions.mySubmission(variables.assignmentId),
      });
      // Invalidate submissions list for teachers
      queryClient.invalidateQueries({
        queryKey: queryKeys.submissions.byAssignment(variables.assignmentId),
      });
      // Update dashboard stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.stats(),
      });
    },
  });
};

export const useGradeSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useToastMutation<
    Submission,
    Error,
    {
      submissionId: string;
      assignmentId: string;
      gradeData: { marks: number; feedback?: string };
    }
  >({
    mutationFn: async ({
      submissionId,
      gradeData,
      assignmentId,
    }: {
      submissionId: string;
      assignmentId: string;
      gradeData: {
        marks: number;
        feedback?: string;
      };
    }) => {
      const response = await axiosInstance.patch(
        `/submissions/${submissionId}/grade`,
        gradeData
      );
      return { ...(getData(response) as Submission), assignmentId };
    },
    successMessage: "Submission graded successfully!",
    errorMessage: "Failed to grade submission",
    onSuccess: (_data, variables) => {
      // Invalidate submissions list for this assignment
      queryClient.invalidateQueries({
        queryKey: queryKeys.submissions.byAssignment(variables.assignmentId),
      });
      // Update dashboard stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.stats(),
      });
    },
  });
};

// ============================================================================
// DASHBOARD QUERIES
// ============================================================================

import type { DashboardStats } from "@/lib/types";

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      const response = await axiosInstance.get("/dashboard");
      return getData(response) as DashboardStats;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true, // Always fresh dashboard data
  });
};

// ============================================================================
// CUSTOM UTILITY MUTATION HOOK
// ============================================================================

import { useApiError } from "./errorHandling";

export function useToastMutation<
  TData = unknown,
  TError extends Error = Error,
  TVariables = void,
  TContext = unknown
>(
  options?: UseMutationOptions<TData, TError, TVariables, TContext> & {
    successMessage?: string;
    errorMessage?: string;
  }
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { getErrorMessage } = useApiError();

  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    onSuccess: (data, variables, context) => {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message = getErrorMessage(error);
      toast.error(message);
      options?.onError?.(error, variables, context);
    },
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to prefetch data for better UX
 */
export const usePrefetchClass = () => {
  const queryClient = useQueryClient();

  return (classId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.classes.detail(classId),
      queryFn: async () => {
        const response = await axiosInstance.get(`/classes/${classId}`);
        return getData(response);
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
};

export const usePrefetchAssignment = () => {
  const queryClient = useQueryClient();

  return (assignmentId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.assignments.detail(assignmentId),
      queryFn: async () => {
        const response = await axiosInstance.get(
          `/assignments/${assignmentId}`
        );
        return getData(response);
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
};

/**
 * Hook to manually invalidate cache when needed
 */
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateClasses: () =>
      queryClient.invalidateQueries({
        queryKey: invalidationKeys.classes.all(),
      }),
    invalidateAssignments: () =>
      queryClient.invalidateQueries({
        queryKey: invalidationKeys.assignments.all(),
      }),
    invalidateSubmissions: () =>
      queryClient.invalidateQueries({
        queryKey: invalidationKeys.submissions.all(),
      }),
    invalidateDashboard: () =>
      queryClient.invalidateQueries({
        queryKey: invalidationKeys.dashboard.all(),
      }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
};
