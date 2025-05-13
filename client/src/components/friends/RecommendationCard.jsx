import { X, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";

export default function RecommendationCard({ user, onHandleRecommendation }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <UserAvatar
          profilePicture={user.profilePicture}
          fullName={user.fullName}
        />
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {user.fullName}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onHandleRecommendation(user._id, false)}
        >
          <X className="h-4 w-4 mr-1" />
          Dismiss
        </Button>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => onHandleRecommendation(user._id, true)}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}
