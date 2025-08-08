import { z } from "zod";

// Form validation schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),
  role: z.enum(["student", "teacher"]),
});

export const createClassSchema = z.object({
  title: z.string().min(2, "Class name must be at least 2 characters").max(100, "Class name must be less than 100 characters"),
  subject: z.string().max(100, "Subject must be less than 100 characters").optional(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
});

export const joinClassSchema = z.object({
  code: z.string().min(1, "Class code is required").max(20, "Invalid class code format"),
});

// API Response validation schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().optional(),
});

export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["student", "teacher"]),
});

export const classSchema = z.object({
  _id: z.string(),
  title: z.string(),
  subject: z.string().optional(),
  description: z.string().optional(),
  code: z.string(),
  teacher: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  students: z.array(z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
  })).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const assignmentSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  classId: z.string(),
  createdBy: z.string(), // Changed from teacherId to match server model
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const dashboardStatsSchema = z.object({
  classes: z.number(),
  assignments: z.number(),
  upcoming: z.number(),
});

// Helper function to preprocess dashboard stats
export const preprocessDashboardStats = (
  data: unknown
): { classes: number; assignments: number; upcoming: number } => {
  return {
    classes:
      typeof (data as { classes?: unknown })?.classes === "number"
        ? (data as { classes: number }).classes
        : 0,
    assignments:
      typeof (data as { assignments?: unknown })?.assignments === "number"
        ? (data as { assignments: number }).assignments
        : 0,
    upcoming:
      typeof (data as { upcoming?: unknown })?.upcoming === "number"
        ? (data as { upcoming: number }).upcoming
        : 0,
  };
};

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateClassFormData = z.infer<typeof createClassSchema>;
export type JoinClassFormData = z.infer<typeof joinClassSchema>;
export type ApiResponse<T = unknown> = z.infer<typeof apiResponseSchema> & { data?: T };
export type User = z.infer<typeof userSchema>;
export type Class = z.infer<typeof classSchema>;
export type Assignment = z.infer<typeof assignmentSchema>;
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
