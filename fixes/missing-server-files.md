# Missing Server Files That Need Implementation

## Issue
Several server files exist but are empty placeholders. These need to be implemented for full API compatibility.

## Files That Need Implementation

### 1. Assignment Validation
File: `src/app/modules/assignment/assignment.validation.ts`
```typescript
import { z } from "zod";

const createAssignment = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    classId: z.string().min(1, "Class ID is required"),
  }),
});

export const AssignmentValidation = {
  createAssignment,
};
```

### 2. Assignment Service
File: `src/app/modules/assignment/assignment.service.ts`
```typescript
import { Assignment } from "./assignment.model";
import { UserPayload } from "../../../interfaces/user.payload";
import { ApiError } from "../../../errors";
import httpStatus from "http-status";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { Classroom } from "../classroom/classroom.model";

const createAssignment = async (user: UserPayload, payload: any) => {
  if (user.role !== ENUM_USER_ROLE.TEACHER) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only teachers can create assignments");
  }

  const { title, description, dueDate, classId } = payload;

  // Verify teacher owns the classroom
  const classroom = await Classroom.findById(classId);
  if (!classroom || !classroom.teacher.equals(user.userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized to create assignment for this class");
  }

  const assignment = await Assignment.create({
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    classId,
    createdBy: user.userId,
  });

  return assignment;
};

export const AssignmentService = {
  createAssignment,
};
```

### 3. Classroom Validation
File: `src/app/modules/classroom/classroom.validation.ts`
```typescript
import { z } from "zod";

const createClass = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    subject: z.string().optional(),
    description: z.string().optional(),
  }),
});

const joinClass = z.object({
  body: z.object({
    code: z.string().min(1, "Class code is required"),
  }),
});

export const ClassroomValidation = {
  createClass,
  joinClass,
};
```

### 4. Submission Validation
File: `src/app/modules/submission/submission.validation.ts`
```typescript
import { z } from "zod";

const submitAssignment = z.object({
  body: z.object({
    assignmentId: z.string().min(1, "Assignment ID is required"),
    submissionText: z.string().optional(),
    submissionFile: z.string().optional(),
  }),
});

const gradeSubmission = z.object({
  body: z.object({
    marks: z.number().min(0),
    feedback: z.string().optional(),
  }),
});

export const SubmissionValidation = {
  submitAssignment,
  gradeSubmission,
};
```

## Recommendation
Implement these files in your server to ensure proper validation and business logic separation. This will make your API more robust and maintainable.
