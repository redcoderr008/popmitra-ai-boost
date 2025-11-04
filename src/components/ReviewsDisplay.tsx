import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  is_anonymous: boolean;
  profiles?: {
    display_name: string | null;
  } | null;
}

export const ReviewsDisplay = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (reviewsError || !reviewsData) {
      return;
    }

    // Fetch profiles for all user_ids
    const userIds = [...new Set(reviewsData.map(r => r.user_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", userIds);

    // Create a map of user_id to display_name
    const profilesMap = new Map(
      profilesData?.map(p => [p.user_id, p.display_name]) || []
    );

    // Merge reviews with profile data
    const reviewsWithProfiles = reviewsData.map(review => ({
      ...review,
      profiles: profilesMap.has(review.user_id) 
        ? { display_name: profilesMap.get(review.user_id) || null }
        : null
    }));

    setReviews(reviewsWithProfiles);
  };


  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return null;
  }

  // Duplicate reviews for infinite scroll effect
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Real reviews from our community
          </p>
          <Button 
            onClick={() => {
              navigate("/review");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            size="sm"
          >
            Add Your Review
          </Button>
        </div>
        
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={`flex gap-6 ${isPaused ? '' : 'animate-scroll'}`}
            style={{
              width: `${duplicatedReviews.length * 400}px`,
            }}
          >
            {duplicatedReviews.map((review, index) => (
              <Card 
                key={`${review.id}-${index}`} 
                className="flex-shrink-0 w-[380px] hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {review.is_anonymous ? "Anonymous User" : (review.profiles?.display_name || "User")}
                      </CardTitle>
                      <CardDescription>
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap line-clamp-4">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
