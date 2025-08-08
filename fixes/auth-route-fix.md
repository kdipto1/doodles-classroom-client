# Fix Auth Route Method

## Issue
Client calls `axiosInstance.post("/auth/me")` but server expects GET request.

## Fix
In your server file `src/app/modules/auth/auth.routes.ts`, change:

```typescript
// BEFORE (incorrect)
router.post(
  "/me",
  auth(ENUM_USER_ROLE.TEACHER, ENUM_USER_ROLE.STUDENT),
  AuthController.getMe,
);

// AFTER (correct)
router.get(
  "/me",
  auth(ENUM_USER_ROLE.TEACHER, ENUM_USER_ROLE.STUDENT),
  AuthController.getMe,
);
```

Also update the client call to use GET instead of POST.
