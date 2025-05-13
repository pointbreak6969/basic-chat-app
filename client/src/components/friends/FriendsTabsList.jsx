import { Bell, UserRoundPlus, Users } from "lucide-react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";

export default function FriendsTabsList({ pendingRequestsCount }) {
  return (
    <TabsList className="grid grid-cols-3 mb-8">
      <TabsTrigger value="requests" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <span>Requests</span>
        {pendingRequestsCount > 0 && (
          <Badge className="ml-1 bg-purple-600 hover:bg-purple-700">
            {pendingRequestsCount}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger
        value="recommendations"
        className="flex items-center gap-2"
      >
        <UserRoundPlus className="h-4 w-4" />
        <span>Recommendations</span>
      </TabsTrigger>
      <TabsTrigger value="friends" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span>My Friends</span>
      </TabsTrigger>
    </TabsList>
  );
}
