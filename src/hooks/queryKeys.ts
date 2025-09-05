/**
 * Centralized query keys for TanStack Query
 * This approach helps with cache invalidation and prevents key mismatches
 */

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Classes queries
  classes: {
    all: ['classes'] as const,
    lists: () => [...queryKeys.classes.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.classes.lists(), { filters }] as const,
    details: () => [...queryKeys.classes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.classes.details(), id] as const,
    myClasses: () => [...queryKeys.classes.all, 'my'] as const,
  },

  // Assignments queries
  assignments: {
    all: ['assignments'] as const,
    lists: () => [...queryKeys.assignments.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.assignments.lists(), { filters }] as const,
    details: () => [...queryKeys.assignments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.assignments.details(), id] as const,
    byClass: (classId: string) =>
      [...queryKeys.assignments.all, 'byClass', classId] as const,
    teacherAssignments: (classId?: string) =>
      [...queryKeys.assignments.all, 'teacher', classId || 'all'] as const,
  },

  // Submissions queries
  submissions: {
    all: ['submissions'] as const,
    lists: () => [...queryKeys.submissions.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.submissions.lists(), { filters }] as const,
    details: () => [...queryKeys.submissions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.submissions.details(), id] as const,
    byAssignment: (assignmentId: string) =>
      [...queryKeys.submissions.all, 'byAssignment', assignmentId] as const,
    mySubmission: (assignmentId: string) =>
      [...queryKeys.submissions.all, 'my', assignmentId] as const,
  },

  // Dashboard queries
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
  },
} as const;

/**
 * Helper function to invalidate related queries
 * Usage: await queryClient.invalidateQueries({ queryKey: invalidationKeys.classes.all() })
 */
export const invalidationKeys = {
  // When classes change, invalidate related data
  classes: {
    all: () => [queryKeys.classes.all[0]],
    withAssignments: () => [queryKeys.classes.all[0], queryKeys.assignments.all[0]],
    withSubmissions: () => [
      queryKeys.classes.all[0],
      queryKeys.assignments.all[0],
      queryKeys.submissions.all[0]
    ],
  },

  // When assignments change, invalidate related data
  assignments: {
    all: () => [queryKeys.assignments.all[0]],
    withSubmissions: () => [queryKeys.assignments.all[0], queryKeys.submissions.all[0]],
    withDashboard: () => [queryKeys.assignments.all[0], queryKeys.dashboard.all[0]],
  },

  // When submissions change, invalidate related data
  submissions: {
    all: () => [queryKeys.submissions.all[0]],
    withDashboard: () => [queryKeys.submissions.all[0], queryKeys.dashboard.all[0]],
    withAssignments: () => [queryKeys.submissions.all[0], queryKeys.assignments.all[0]],
  },

  // Dashboard invalidation
  dashboard: {
    all: () => [queryKeys.dashboard.all[0]],
  },
} as const;
