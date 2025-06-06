import { X, Check } from "lucide-react";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";

export default function RequestCard({ request, onHandleRequest }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <UserAvatar
          profilePicture={request.sender.profilePicture}
          fullName={request.sender.fullName}
        />
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {request.sender.fullName}
          </h4>
        
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950"
          onClick={() => onHandleRequest(request._id, false)}
        >
          <X className="h-4 w-4 text-red-500 mr-1" />
          Decline
        </Button>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => onHandleRequest(request._id, true)}
        >
          <Check className="h-4 w-4 mr-1" />
          Accept
        </Button>
      </div>
    </div>
  );
}
