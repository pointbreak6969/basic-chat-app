import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";

export default function FriendsHeader({ onAddFriend }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Friends
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your friends, requests, and discover new people
        </p>
      </div>

      <Button
        onClick={onAddFriend}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Add Friend
      </Button>
    </div>
  );
}
