import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // In a real application, you would call your API here
      // await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md">
        {!isSubmitted ? (
          <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader className="space-y-1">
              {/* <div className="flex items-center mb-2">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
                </Link>
              </div> */}
              <CardTitle className="text-2xl font-bold text-center">
                Reset Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a link to reset your
                password
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-center">
                We've sent a password reset link to{" "}
                <span className="font-medium">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                If you don't see the email in your inbox, please check your spam
                folder. The link will expire in 24 hours.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full"
              >
                Try another email
              </Button>
              <div className="text-center text-sm mt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
