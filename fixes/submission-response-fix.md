# Fix Submission Response Formats

## Issue
Submission controllers return data directly or with incorrect format.

## Fix
In your server file `src/app/modules/submission/submission.controller.ts`, update all response formats:

### 1. submitAssignment
```typescript
// BEFORE (incorrect)
res.status(httpStatus.CREATED).json(submission);

// AFTER (correct)
res.status(httpStatus.CREATED).json({
  success: true,
  statusCode: httpStatus.CREATED,
  message: "Assignment submitted successfully",
  data: submission
});

// Also fix error responses
res.status(httpStatus.FORBIDDEN).json({
  success: false,
  statusCode: httpStatus.FORBIDDEN,
  message: "Only students can submit assignments",
});

res.status(httpStatus.BAD_REQUEST).json({
  success: false,
  statusCode: httpStatus.BAD_REQUEST,
  message: "Already submitted",
});
```

### 2. getSubmissionsByAssignment
```typescript
// BEFORE (incorrect)
res.status(httpStatus.OK).json(submissions);

// AFTER (correct)
res.status(httpStatus.OK).json({
  success: true,
  statusCode: httpStatus.OK,
  message: "Submissions retrieved successfully",
  data: submissions
});
```

### 3. getMySubmission
```typescript
// BEFORE (incorrect)
res.status(httpStatus.OK).json(submission);

// AFTER (correct)
res.status(httpStatus.OK).json({
  success: true,
  statusCode: httpStatus.OK,
  message: "Submission retrieved successfully",
  data: submission
});
```

### 4. gradeSubmission
```typescript
// BEFORE (incorrect)
res.status(httpStatus.OK).json({
  message: "Graded successfully",
  submission,
});

// AFTER (correct)
res.status(httpStatus.OK).json({
  success: true,
  statusCode: httpStatus.OK,
  message: "Graded successfully",
  data: submission,
});

// Also fix error response
res.status(httpStatus.NOT_FOUND).json({
  success: false,
  statusCode: httpStatus.NOT_FOUND,
  message: "Submission not found",
});
```
