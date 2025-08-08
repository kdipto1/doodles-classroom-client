# Fix Assignment Response Formats

## Issue
Assignment controllers return data directly without standardized response wrapper.

## Fix
In your server file `src/app/modules/assignment/assignment.controller.ts`, update all response formats:

### 1. createAssignment
```typescript
// BEFORE (incorrect)
res.status(httpStatus.CREATED).json(assignment);

// AFTER (correct)
res.status(httpStatus.CREATED).json({
  success: true,
  statusCode: httpStatus.CREATED,
  message: "Assignment created successfully",
  data: assignment
});
```

### 2. getAssignmentsByClass
```typescript
// BEFORE (incorrect)
res.status(httpStatus.OK).json(enriched);

// AFTER (correct)
res.status(httpStatus.OK).json({
  success: true,
  statusCode: httpStatus.OK,
  message: "Assignments retrieved successfully",
  data: enriched
});
```

### 3. getAssignmentById
```typescript
// BEFORE (incorrect)
res.status(httpStatus.OK).json(assignment);

// AFTER (correct)
res.status(httpStatus.OK).json({
  success: true,
  statusCode: httpStatus.OK,
  message: "Assignment retrieved successfully",
  data: assignment
});

// Also fix error response
res.status(httpStatus.NOT_FOUND).json({ 
  success: false,
  statusCode: httpStatus.NOT_FOUND,
  message: "Assignment not found" 
});
```
