import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import friendService from "@/services/FriendService";
import {toast} from "sonner"
// Import new components
import FriendsHeader from "./friends/FriendsHeader";
import FriendsTabsList from "./friends/FriendsTabsList";
import PendingRequestsTab from "./friends/PendingRequestsTab";
import RecommendationsTab from "./friends/RecommendationsTab";
import MyFriendsTab from "./friends/MyFriendsTab";
import AddFriendDialog from "./friends/AddFriendDialog";

export default function Friends({
  friends,
  pendingRequests,
  searchResults,
  searchQuery,
  setSearchQuery,
  activeTab,
  onTabChange,
  loadMoreRecommendations,
  recommendationsHasMore,
}) {
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [addFriendStatus, setAddFriendStatus] = useState(null);
  const [addFriendMessage, setAddFriendMessage] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const initialRecommendations = Array.isArray(searchResults)
      ? searchResults
      : searchResults?.users || [];
    setRecommendations(initialRecommendations);
  }, [searchResults, addFriendStatus]);

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
        await friendService.respondToFriendRequest(requestId, "true");
      } else {
        await friendService.respondToFriendRequest(requestId, "false");
      }
      onTabChange("requests");
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  const handleRecommendation = async (userId, add) => {
    try {
      if (add) {
        await friendService.addFriend(userId);
        setAddFriendStatus("success");
        toast.success("Friend request sent!");
      } else {
        setRecommendations(prevRecommendations => 
          prevRecommendations.filter(user => user._id !== userId)
        );
      }
      onTabChange("recommendations");
    } catch (error) {
      console.error("Error handling recommendation:", error);
      setAddFriendStatus("error");
      setAddFriendMessage("Failed to send friend request. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleAddFriend = async () => {
    if (!friendUsername.trim()) return;
    try {
      await friendService.sendFriendRequest(friendUsername);
      setAddFriendStatus("success");
      setAddFriendMessage(`Friend request sent to ${friendUsername}!`);
      setFriendUsername("");
      setTimeout(() => setAddFriendStatus(null), 3000);
      onTabChange("sentRequests");
    } catch (error) {
      console.error("Error adding friend:", error);
      setAddFriendStatus("error");
      setAddFriendMessage("Failed to send friend request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Back button */}
        <div className="flex items-center mb-4">
          <Link
            to="/settings"
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Settings
          </Link>
        </div>

        {/* Header */}
        <FriendsHeader onAddFriend={() => setShowAddFriendDialog(true)} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <FriendsTabsList pendingRequestsCount={pendingRequests.length} />
          
          {/* Tab Contents */}
          <TabsContent value="requests">
            <PendingRequestsTab 
              pendingRequests={pendingRequests} 
              onTabChange={onTabChange}
              onHandleRequest={handleFriendRequest} 
            />
          </TabsContent>

          <TabsContent value="recommendations">
            <RecommendationsTab 
              recommendations={recommendations}
              hasMore={recommendationsHasMore}
              loadMore={loadMoreRecommendations}
              onHandleRecommendation={handleRecommendation}
              onShowAddFriendDialog={() => setShowAddFriendDialog(true)}
            />
          </TabsContent>

          <TabsContent value="friends">
            <MyFriendsTab 
              friends={filteredFriends}
              allFriendsCount={friends.length}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              onTabChange={onTabChange}
              onShowAddFriendDialog={() => setShowAddFriendDialog(true)}
            />
          </TabsContent>
        </Tabs>

        {/* Add Friend Dialog */}
        <AddFriendDialog
          open={showAddFriendDialog}
          onOpenChange={setShowAddFriendDialog}
          friendUsername={friendUsername}
          setFriendUsername={setFriendUsername}
          addFriendStatus={addFriendStatus}
          addFriendMessage={addFriendMessage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          onAddFriend={handleAddFriend}
          onSearch={handleSearch}
          onHandleRecommendation={handleRecommendation}
        />
      </div>
    </div>
  );
}
