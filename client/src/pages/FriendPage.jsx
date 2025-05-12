import { Suspense, useEffect, useState } from "react";
import Friends from "@/components/Friends";
import  friendService  from "@/services/FriendService";

const FriendPage = () => {
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSentRequests, setShowSentRequests] = useState(false);
    
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await friendService.getFriends();
                setFriends(response.data);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };
        const fetchPendingRequests = async () => {
            try {
                const response = await friendService.getPendingRequests();
                setPendingRequests(response.data);
            } catch (error) {
                console.error("Error fetching pending requests:", error);
            }
        };
        const fetchSentRequests = async () => {
            try {
                const response = await friendService.getSentRequests();
                setSentRequests(response.data);
            } catch (error) {
                console.error("Error fetching sent requests:", error);
            }
        };
        const fetchSearchResults = async () => {
            try {
                const response = await friendService.searchFriends(searchQuery);
                setSearchResults(response.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };
      
        fetchFriends();
        fetchPendingRequests();
        fetchSentRequests();
        fetchSearchResults();
    }, [searchQuery]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Friends friends={friends} pendingRequests={pendingRequests} sentRequests={sentRequests} searchResults={searchResults} searchQuery={searchQuery} setSearchQuery={setSearchQuery} showSentRequests={showSentRequests} setShowSentRequests={setShowSentRequests} />
        </Suspense>
    );
};
export default FriendPage;
