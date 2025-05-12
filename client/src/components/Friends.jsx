import { Label } from "./ui/label";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  UserPlus,
  UserX,
  X,
  Check,
  MessageSquare,
  Users,
  Bell,
  UserRoundPlus,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import UserAvatar from "./UserAvatar";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import friendService from "@/services/FriendService";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Friends({
  friends,
  pendingRequests,
  sentRequests,
  searchResults,
  searchQuery,
  setSearchQuery,
  activeTab,
  onTabChange,
  loadMoreRecommendations,
  recommendationsHasMore,
  recommendationPage,
}) {
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [addFriendStatus, setAddFriendStatus] = useState(null);
  const [addFriendMessage, setAddFriendMessage] = useState("");

  const filteredFriends = useMemo(() => {
    if (!Array.isArray(friends)) return [];
    if (!searchQuery) return friends;
    return friends.filter((friend) =>
      friend?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  const handleFriendRequest = async (requestId, accept) => {
    try {
      if (accept) {
        await friendService.acceptFriendRequest(requestId);
      } else {
        await friendService.rejectFriendRequest(requestId);
      }
      // Update data via SWR by fetching the "requests" tab data
      onTabChange("requests");
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  const handleRecommendation = async (userId, add) => {
    try {
      if (add) {
        await friendService.sendFriendRequest(userId);
        setAddFriendStatus("success");
        setAddFriendMessage("Friend request sent successfully!");
      } else {
        // Just dismiss the recommendation visually
        console.log("Dismissed recommendation:", userId);
      }
      // Refresh recommendations via SWR
      onTabChange("recommendations");
    } catch (error) {
      console.error("Error handling recommendation:", error);
      setAddFriendStatus("error");
      setAddFriendMessage("Failed to send friend request. Please try again.");
    }
  };

  // Form handler for search
  const handleSearch = (e) => {
    e.preventDefault();
    // The SWR hook in parent will handle the data fetching based on searchQuery
  };

  const handleAddFriend = async () => {
    if (!friendUsername.trim()) return;

    try {
      await friendService.sendFriendRequest(friendUsername);
      setAddFriendStatus("success");
      setAddFriendMessage(`Friend request sent to ${friendUsername}!`);
      setFriendUsername("");
      setTimeout(() => setAddFriendStatus(null), 3000);
      // Refresh sent requests tab
      onTabChange("sentRequests");
    } catch (error) {
      console.error("Error adding friend:", error);
      setAddFriendStatus("error");
      setAddFriendMessage("Failed to send friend request. Please try again.");
    }
  };

  // Get the actual recommendations array from the response object
  const recommendationsArray = Array.isArray(searchResults) 
    ? searchResults 
    : (searchResults?.users || []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-4">
          <Link
            to="/settings"
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Settings
          </Link>
        </div>

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
            onClick={() => setShowAddFriendDialog(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Friend
          </Button>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={onTabChange} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Requests</span>
              {pendingRequests.length > 0 && (
                <Badge className="ml-1 bg-purple-600 hover:bg-purple-700">
                  {pendingRequests.length}
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

          {/* Friend Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Friend Requests</CardTitle>
                <CardDescription>
                  People who want to connect with you
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
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
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            profilePicture={request.avatar}
                            fullName={request.name}
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {request.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {request.mutualFriends} mutual friends
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950"
                            onClick={() =>
                              handleFriendRequest(request.id, false)
                            }
                          >
                            <X className="h-4 w-4 text-red-500 mr-1" />
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() =>
                              handleFriendRequest(request.id, true)
                            }
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Friends</CardTitle>
                <CardDescription>
                  People you might know based on mutual connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendationsArray.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
                      <UserRoundPlus className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No recommendations
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                      Try searching for people to connect with
                    </p>
                    <Button
                      variant="link"
                      onClick={() => setShowAddFriendDialog(true)}
                      className="mt-4 text-purple-600 hover:text-purple-700"
                    >
                      Add Friend Manually
                    </Button>
                  </div>
                ) : (
                  <div id="recommendationsScrollContainer" className="overflow-auto max-h-[70vh]">
                    <InfiniteScroll
                      dataLength={recommendationsArray.length}
                      next={loadMoreRecommendations}
                      hasMore={recommendationsHasMore}
                      loader={<div className="text-center py-4">Loading more...</div>}
                      endMessage={
                        <p className="text-center mt-4 text-sm text-gray-500">
                          All recommendations loaded!
                        </p>
                      }
                      scrollableTarget="recommendationsScrollContainer"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendationsArray.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                          >
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
                                onClick={() => handleRecommendation(user._id, false)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Dismiss
                              </Button>
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                                onClick={() => handleRecommendation(user._id, true)}
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </InfiniteScroll>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends">
            <Card>
              <CardHeader>
                <CardTitle>My Friends</CardTitle>
                <CardDescription>
                  Your current friends and connections
                </CardDescription>
                <div className="mt-4">
                  <form onSubmit={handleSearch}>
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
                        onClick={() => setShowAddFriendDialog(true)}
                      >
                        Add Friend
                      </Button>
                    </div>
                  </div>
                ) : filteredFriends.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No friends match your search for "{searchQuery}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <UserAvatar
                              profilePicture={friend.avatar}
                              fullName={friend.name}
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
                              {friend.name}
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
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Friend Dialog */}
        <Dialog
          open={showAddFriendDialog}
          onOpenChange={setShowAddFriendDialog}
        >
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

                  <form onSubmit={handleSearch} className="mb-4">
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
                            onClick={() => handleRecommendation(result.id, true)}
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
                onClick={() => setShowAddFriendDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleAddFriend}
                disabled={addFriendStatus === "success"}
              >
                Send Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
