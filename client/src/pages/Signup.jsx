import React from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { MessageCircle, Mail, Lock, User, Github, Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUpSchema } from "../schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../store/authSlice";
import { useForm } from "react-hook-form";


const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema), // Use signupSchema for registration
    defaultValues: {
      fullName:"",
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await authService.register(data);
      if (response.statusCode === 200) {
        console.log(response);
        dispatch(login(response.data));
        socket.connect(); // Connect the socket after successful registration
        navigate("/"); // Redirect to home page after successful registration
      }
    } catch (error) {
      console.error("Registration failed:", error); 

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
        {/* Signup Card */}
      <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Join Chatty</CardTitle>
            <CardDescription className="text-center">
              Create a new account to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Use react-hook-form register for inputs */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    className="pl-10"
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    placeholder="name@example.com"
                    type="email"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10" // Add right padding for the icon
                    {...register("password")}
                  />
                  <button
                    type="button" // Prevent form submission
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remove confirm password if not in schema or add it */}
              {/*
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    className="pl-10"
                    // Add register for confirm password if needed
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
              </div>
              */}

              <div className="flex items-center space-x-2 mt-4">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <span className="text-purple-600 hover:underline cursor-pointer">
                    terms of service
                  </span>{" "}
                  and{" "}
                  <span className="text-purple-600 hover:underline cursor-pointer">
                    privacy policy
                  </span>
                </Label>
              </div>
              {/* Submit button should be inside the form */}
              <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {/* Remove the onClick from the button here as it's handled by form onSubmit */}
            {/* <Button onClick={handleSubmit(onSubmit)} className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button> */}

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
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
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")} // Add navigation to login
                className="text-purple-600 hover:underline cursor-pointer"
              >
                Login
              </span>
            </div>
          </CardFooter>
        </Card>
       
      </div>
    </div>
  );
};

export default Signup;
