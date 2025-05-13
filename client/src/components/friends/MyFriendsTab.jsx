import { Search, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import FriendCard from "./FriendCard";

export default function MyFriendsTab({ 
  friends, 
  allFriendsCount,
  searchQuery,
  setSearchQuery,
  onSearch,
  onTabChange,
  onShowAddFriendDialog
}) {
  if (allFriendsCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Friends</CardTitle>
          <CardDescription>
            Your current friends and connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No friends yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              You haven't added any friends yet. Check your requests or
              add friends to get started.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => onTabChange("requests")}
              >
                View Requests
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={onShowAddFriendDialog}
              >
                Add Friend
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Friends</CardTitle>
        <CardDescription>
          Your current friends and connections
        </CardDescription>
        <div className="mt-4">
          <form onSubmit={onSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </form>
        </div>
      </CardHeader>
      <CardContent>
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No friends match your search for "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
