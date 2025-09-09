import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/hooks/queries";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    await registerMutation.mutateAsync(data);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8 pb-20 md:pb-12">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-800 p-6 sm:p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-50">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join and start your journey
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name
              </label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
                className="text-base"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email address
              </label>
              <Input
                id="email"
                placeholder="Enter your email"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
                autoComplete="email"
                className="text-base"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                  autoComplete="new-password"
                  className="text-base pr-12"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600 focus:outline-none z-50 dark:text-gray-400 dark:hover:text-blue-500 min-h-[44px] min-w-[44px]"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7-2s-2.5-5-10-5-10 5-10 5 2.5 5 10 5 10-5 10-5z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                I am a...
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[60px]">
                      <RadioGroupItem value="student" id="r1" className="mt-0.5" />
                      <div>
                        <Label htmlFor="r1" className="font-medium cursor-pointer">Student</Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Join classes and submit assignments</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[60px]">
                      <RadioGroupItem value="teacher" id="r2" className="mt-0.5" />
                      <div>
                        <Label htmlFor="r2" className="font-medium cursor-pointer">Teacher</Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create classes and assignments</p>
                      </div>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.role && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              size="xl"
              className="w-full text-base font-semibold"
            >
              {registerMutation.isPending ? (
                <>
                  <LoadingSpinner className="h-5 w-5 text-white mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Already have an account? Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
