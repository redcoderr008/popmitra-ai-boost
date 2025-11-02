import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, ArrowLeft, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  is_anonymous: boolean;
  display_name?: string;
}

const Review = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
      return;
    }

    // Fetch display names separately for each review
    const reviewsWithProfiles = await Promise.all(
      (data || []).map(async (review) => {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", review.user_id)
          .maybeSingle();
        
        return {
          ...review,
          display_name: profileData?.display_name,
        };
      })
    );

    setReviews(reviewsWithProfiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a review",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      rating,
      comment: comment.trim(),
      is_anonymous: isAnonymous,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Review submitted successfully",
      });
      setRating(0);
      setComment("");
      setIsAnonymous(false);
      setShowForm(false);
      fetchReviews();
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= currentRating
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl pt-24 md:pt-28">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/")}
            className="w-fit"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Reviews</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              See what our users are saying about us
            </p>
          </div>
        </div>

        <div className="mb-8">
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} size="lg" className="w-full md:w-auto">
              Write a Review
            </Button>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Write Your Review</CardTitle>
                <CardDescription className="text-sm md:text-base">Share your experience with us</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rating
                    </label>
                    {renderStars(rating, true)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Comment
                    </label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about your experience..."
                      className="min-h-[120px]"
                      maxLength={1000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {comment.length}/1000 characters
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                    />
                    <label
                      htmlFor="anonymous"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Post anonymously
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setRating(0);
                        setComment("");
                        setIsAnonymous(false);
                      }}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            All Reviews ({reviews.length})
          </h2>
          
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No reviews yet. Be the first to write one!
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-base md:text-lg">
                        {review.is_anonymous ? "Anonymous User" : (review.display_name || "User")}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
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
                  <p className="text-sm md:text-base text-foreground whitespace-pre-wrap break-words">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Review;
