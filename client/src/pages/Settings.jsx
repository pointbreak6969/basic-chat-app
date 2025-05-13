import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  KeyRound,
  User,
Users,
  HelpCircle,
  Flag,
  FileText,
  Shield,
  Cookie,
  ChevronRight,
  Moon,
  Sun,
  ArrowLeft,
  Image,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "react-router-dom";
const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [username, setUsername] = useState("JohnDoe");
  const [showRemoveFriendDialog, setShowRemoveFriendDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/100");
  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

 return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-4">
          <Link
           to={"/"}
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Chat
          </Link>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)} className="rounded-full">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Account Settings */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Username</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{username}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Username</DialogTitle>
                    <DialogDescription>
                      Change your username. This will be visible to all your friends.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Image className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Profile Picture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img 
                          src={profilePicture} 
                          alt="Profile" 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Profile Picture</DialogTitle>
                    <DialogDescription>
                      Upload a new profile picture or change your existing one.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 flex flex-col items-center gap-4">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <Label 
                        htmlFor="picture-upload" 
                        className="flex items-center gap-2 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        <Image className="h-4 w-4" />
                        Choose Image
                      </Label>
                      <Input
                        id="picture-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setProfilePicture(event.target.result);
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => setProfilePicture("https://via.placeholder.com/100")}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <KeyRound className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Update your password to keep your account secure.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" className="mt-2" />
                    </div>
                    <div className="text-right">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="bg-purple-600 hover:bg-purple-700">Update Password</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

               <Link
                to="/friends"
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Friends</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Logout</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</span>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Support</h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Help</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Flag className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Report a Problem</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Terms of Service</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Privacy Policy</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Cookie className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cookie Policy</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Settings;
