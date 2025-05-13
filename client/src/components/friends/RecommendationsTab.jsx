import { UserRoundPlus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import InfiniteScroll from "react-infinite-scroll-component";
import RecommendationCard from "./RecommendationCard";

export default function RecommendationsTab({ 
  recommendations, 
  hasMore, 
  loadMore, 
  onHandleRecommendation, 
  onShowAddFriendDialog 
}) {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Friends</CardTitle>
          <CardDescription>
            People you might know based on mutual connections
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              onClick={onShowAddFriendDialog}
              className="mt-4 text-purple-600 hover:text-purple-700"
            >
              Add Friend Manually
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Friends</CardTitle>
        <CardDescription>
          People you might know based on mutual connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          id="recommendationsScrollContainer"
          className="overflow-auto max-h-[70vh]"
        >
          <InfiniteScroll
            dataLength={recommendations.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">Loading more...</div>
            }
            endMessage={
              <p className="text-center mt-4 text-sm text-gray-500">
                All recommendations loaded!
              </p>
            }
            scrollableTarget="recommendationsScrollContainer"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((user) => (
                <RecommendationCard
                  key={user._id}
                  user={user}
                  onHandleRecommendation={onHandleRecommendation}
                />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </CardContent>
    </Card>
  );
}
