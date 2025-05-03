import React from 'react'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageCircle, Mail, Lock, User, Github } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
const Signup = () => {
  return (
<div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and app name */}
        <div className="flex items-center justify-center mb-8">
          <MessageCircle className="h-10 w-10 text-purple-500" />
          <span className="text-3xl font-bold ml-2 text-gray-800">Chatty</span>
        </div>
        
        {/* Success Message */}
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              Account created successfully!
            </AlertDescription>
          </Alert>
        )}
        
        {/* Signup Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Join Chatty</CardTitle>
            <CardDescription className="text-center">
              Create a new account to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="fullname" 
                  placeholder="John Doe" 
                  className="pl-10"
                />
              </div>
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
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="signup-password" 
                  type="password" 
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="confirm-password" 
                  type="password" 
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm">
                I agree to the <span className="text-purple-600 hover:underline cursor-pointer">terms of service</span> and <span className="text-purple-600 hover:underline cursor-pointer">privacy policy</span>
              </Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
            
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </div>
            
            <div className="text-center mt-4 text-sm">
              Already have an account?{" "}
              <span className="text-purple-600 hover:underline cursor-pointer">
                Login
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Signup