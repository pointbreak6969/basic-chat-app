import { MessageSquare, UserX } from "lucide-react";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";

export default function FriendCard({ friend }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="relative">
          <UserAvatar
            profilePicture={friend.profilePicture}
            fullName={friend.fullName}
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
              friend.status === "online"
                ? "bg-green-500"
                : friend.status === "away"
                ? "bg-yellow-500"
                : "bg-gray-400"
            }`}
          />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {friend.fullName}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {friend.status}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
        >
          <MessageSquare className="h-4 w-4 text-purple-600" />
          <span className="sr-only">Message</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950"
        >
          <UserX className="h-4 w-4 text-red-500" />
          <span className="sr-only">Remove Friend</span>
        </Button>
      </div>
    </div>
  );
}
