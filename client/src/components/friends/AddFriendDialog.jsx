import { Search, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import UserAvatar from "../UserAvatar";

export default function AddFriendDialog({
  open,
  onOpenChange,
  friendUsername,
  setFriendUsername,
  addFriendStatus,
  addFriendMessage,
  searchQuery,
  setSearchQuery,
  searchResults,
  onAddFriend,
  onSearch,
  onHandleRecommendation,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Send a friend request by username or search for people
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="friend-username">Username</Label>
              <Input
                id="friend-username"
                placeholder="Enter username"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                className="mt-1"
              />
            </div>

            {addFriendStatus && (
              <Alert
                variant={
                  addFriendStatus === "error" ? "destructive" : "default"
                }
                className={
                  addFriendStatus === "success"
                    ? "border-green-200 text-green-800 dark:border-green-800 dark:text-green-300"
                    : ""
                }
              >
                <AlertDescription>{addFriendMessage}</AlertDescription>
              </Alert>
            )}

            <div>
              <Separator className="my-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Or search for people by name
              </p>

              <form onSubmit={onSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Search people..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </form>

              {searchQuery && searchResults.length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          profilePicture={result.avatar}
                          fullName={result.name}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {result.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {result.mutualFriends} mutual friends
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() =>
                          onHandleRecommendation(result.id, true)
                        }
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={onAddFriend}
            disabled={addFriendStatus === "success"}
          >
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
