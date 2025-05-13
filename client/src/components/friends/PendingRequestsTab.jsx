import { Bell, X, Check } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import RequestCard from "./RequestCard";

export default function PendingRequestsTab({ pendingRequests, onTabChange, onHandleRequest }) {
  if (pendingRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Friend Requests</CardTitle>
          <CardDescription>
            People who want to connect with you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
              <Bell className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No pending requests
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              You don't have any friend requests at the moment. Check
              out our recommendations!
            </p>
            <Button
              variant="link"
              onClick={() => onTabChange("recommendations")}
              className="mt-4 text-purple-600 hover:text-purple-700"
            >
              View Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friend Requests</CardTitle>
        <CardDescription>
          People who want to connect with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <RequestCard 
              key={request._id}
              request={request}
              onHandleRequest={onHandleRequest}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
