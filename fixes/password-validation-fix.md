# Fix Password Validation Mismatch

## Issue
Client and server have different password validation requirements:
- Client: minimum 6 characters in `registerSchema`
- Server: minimum 8 characters in `auth.validation.ts`

## Fix
Choose one approach and make both sides consistent:

### Option 1: Update Client to Match Server (Recommended)
In `src/lib/validation.ts`:
```typescript
// BEFORE (incorrect)
export const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be less than 100 characters"),
  role: z.enum(["student", "teacher"]),
});

// AFTER (correct)
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
```

### Option 2: Update Server to Match Client (Less Secure)
In server `src/constants/common.ts`:
```typescript
export const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 6, // Changed from 8
  PASSWORD_MAX_LENGTH: 100,
  JWT_SECRET_MIN_LENGTH: 32,
} as const;
```

## Recommendation
Use Option 1 to maintain stronger password security requirements.
