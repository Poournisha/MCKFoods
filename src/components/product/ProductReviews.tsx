import { useState, useEffect } from "react";
import { api } from "@/db/api";
import { useAuth } from "@/components/auth/AuthProvider";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";
import type { ProductReviewWithUser } from "@/types/types";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ProductReviewWithUser[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState<ProductReviewWithUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  useEffect(() => {
    if (user) {
      loadUserReview();
    }
  }, [user, productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const [reviewsData, avgRating, count] = await Promise.all([
        api.getProductReviews(productId),
        api.getAverageRating(productId),
        api.getReviewCount(productId),
      ]);
      setReviews(reviewsData);
      setAverageRating(avgRating);
      setReviewCount(count);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const loadUserReview = async () => {
    if (!user) return;
    
    try {
      const review = await api.getUserReviewForProduct(productId, user.id);
      if (review) {
        setUserReview(review as ProductReviewWithUser);
        setRating(review.rating);
        setComment(review.comment);
      } else {
        // Clear state if no review found
        setUserReview(null);
        setRating(0);
        setComment("");
      }
    } catch (error) {
      console.error("Failed to load user review:", error);
      // Clear state on error
      setUserReview(null);
      setRating(0);
      setComment("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("handleSubmit called", { user, rating, comment, userReview });

    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setSubmitting(true);

      if (userReview) {
        // Update existing review
        console.log("Updating existing review:", userReview.id);
        await api.updateReview(userReview.id, { rating, comment });
        toast.success("Review updated successfully");
      } else {
        // Create new review
        console.log("Creating new review for product:", productId, "user:", user.id);
        const newReview = await api.createReview({
          product_id: productId,
          user_id: user.id,
          rating,
          comment,
        });
        console.log("Review created successfully:", newReview);
        toast.success("Review submitted successfully");
      }

      // Reset form
      setRating(0);
      setComment("");
      setIsEditing(false);

      // Reload reviews
      console.log("Reloading reviews...");
      await loadReviews();
      await loadUserReview();
      console.log("Reviews reloaded");
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      if (error.message?.includes("duplicate")) {
        toast.error("You have already reviewed this product");
      } else {
        toast.error(`Failed to submit review: ${error.message || "Unknown error"}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;

    if (!confirm("Are you sure you want to delete your review?")) {
      return;
    }

    try {
      await api.deleteReview(userReview.id);
      toast.success("Review deleted successfully");
      setUserReview(null);
      setRating(0);
      setComment("");
      setIsEditing(false);
      await loadReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    }
  };

  const handleEdit = () => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
    } else {
      setRating(0);
      setComment("");
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} readonly size="md" />
              <div className="text-sm text-muted-foreground mt-1">
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>
              {userReview && !isEditing
                ? "Your Review"
                : userReview
                ? "Edit Your Review"
                : "Write a Review"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userReview && !isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <StarRating rating={userReview.rating} readonly size="md" />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(userReview.created_at)}
                  </span>
                </div>
                <p className="text-sm">{userReview.comment}</p>
                <div className="flex gap-2">
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Rating
                  </label>
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    size="lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Comment
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : userReview ? (
                      "Update Review"
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">
              Please log in to write a review
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Reviews</h3>
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {review.user_name || "Anonymous"}
                          </p>
                          {review.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              ⭐ Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}