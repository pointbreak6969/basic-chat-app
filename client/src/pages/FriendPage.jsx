import { Suspense, useState } from "react";
import Friends from "@/components/Friends";
import friendService from "@/services/FriendService";
import useSWR from "swr";

const FriendPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSentRequests, setShowSentRequests] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");

  // SWR hooks for data fetching
  const { data: friends = [], mutate: mutateFriends } = useSWR(
    "friends",
    () => friendService.getFriends(searchQuery).then(res => res.data.friends)
  );
  
  const { data: pendingRequests = [], mutate: mutatePendingRequests } = useSWR(
    "pendingRequests",
    () => friendService.getPendingRequests().then(res => res.data)
  );
  console.log("Pending Requests", pendingRequests);
  
  const { data: sentRequests = [], mutate: mutateSentRequests } = useSWR(
    "sentRequests",
    () => friendService.getSentRequests().then(res => res.data)
  );
  
//   const { data: searchResults = [] } = useSWR(
//     searchQuery ? ["searchFriends", searchQuery] : null,
//     () => friendService.searchFriends(searchQuery).then(res => res.data)
//   );

  const { data: recommendations = [] } = useSWR(
    activeTab === "recommendations" ? "recommendations" : null,
    () => friendService.getRecommendations().then(res => res.data)
  );


  // Function to fetch data based on active tab
  const fetchData = async (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "requests":
        await mutatePendingRequests();
        break;
      case "friends":
        await mutateFriends();
        break;
      case "sentRequests":
        await mutateSentRequests();
        break;
      // For recommendations, the SWR hook will handle it when activeTab changes
      default:
        break;
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Friends
        friends={friends}
        pendingRequests={pendingRequests}
        sentRequests={sentRequests}
        searchResults={searchQuery ? searchResults : recommendations}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSentRequests={showSentRequests}
        setShowSentRequests={setShowSentRequests}
        onTabChange={fetchData}
        activeTab={activeTab}
      />
    </Suspense>
  );
};

export default FriendPage;
