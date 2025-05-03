import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Mail, Lock, User, Github } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { login } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import authService from "@/services/authService";

export default function LoginSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null); // State for login error
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema), // Use signInSchema for login
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setLoginError(null); // Clear previous errors
    try {
      const response = await authService.login(data);
      if (response.status === 200) {
        dispatch(login(response.data));
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Set a user-friendly error message
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and app name */}
        <div className="flex items-center justify-center mb-8">
          <MessageCircle className="h-10 w-10 text-purple-500" />
          <span className="text-3xl font-bold ml-2 text-gray-800">Chatty</span>
        </div>

        {/* Login Error Message */}
        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        {/* Login Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Login to your Chatty account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`} // Add error styling
                    {...register("email")} // Register email field
                  />
                </div>
                {errors.email && ( // Display email validation error
                  <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-sm text-purple-600 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // Toggle password visibility
                    className={`pl-10 ${errors.password ? "border-red-500" : ""}`} // Add error styling
                    {...register("password")} // Register password field
                  />
                  {/* Consider adding a button to toggle showPassword state */}
                </div>
                {errors.password && ( // Display password validation error
                  <p className="text-xs text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </div>

              <div className="text-center mt-4 text-sm">
                Don't have an account?{" "}
                <span className="text-purple-600 hover:underline cursor-pointer">
                  Sign up
                </span>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
