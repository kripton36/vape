export type Review = {
  id: number
  productId: number
  userId?: number
  userName: string
  rating: number
  comment: string
  isVerified: boolean
  helpfulCount: number
  createdAt: Date
}

// Review service
export const reviewService = {
  // Get reviews for a product
  async getProductReviews(productId: number): Promise<Review[]> {
    try {
      // In a real app, this would fetch from the database
      // For now, we'll use mock data
      return mockReviews.filter((r) => r.productId === productId)
    } catch (error) {
      console.error(`Get reviews for product ${productId} error:`, error)
      return []
    }
  },

  // Add a review
  async addReview(data: {
    productId: number
    userId?: number
    userName: string
    rating: number
    comment: string
    isVerified?: boolean
  }): Promise<Review | null> {
    try {
      // In a real app, this would add to the database
      // For now, we'll just return a mock review
      const review: Review = {
        id: Math.floor(Math.random() * 10000) + 1,
        productId: data.productId,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
        isVerified: data.isVerified || false,
        helpfulCount: 0,
        createdAt: new Date(),
      }

      return review
    } catch (error) {
      console.error(`Add review for product ${data.productId} error:`, error)
      return null
    }
  },

  // Mark a review as helpful
  async markReviewHelpful(reviewId: number): Promise<boolean> {
    try {
      // In a real app, this would update the database
      return true
    } catch (error) {
      console.error(`Mark review ${reviewId} as helpful error:`, error)
      return false
    }
  },

  // Calculate average rating for a product
  async getProductRatingStats(productId: number): Promise<{
    averageRating: number
    totalReviews: number
    ratingCounts: { [key: number]: number }
  }> {
    try {
      const reviews = await this.getProductReviews(productId)

      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        }
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length

      // Count reviews by rating
      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          ratingCounts[review.rating]++
        }
      })

      return {
        averageRating,
        totalReviews: reviews.length,
        ratingCounts,
      }
    } catch (error) {
      console.error(`Get rating stats for product ${productId} error:`, error)
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    }
  },
}

// Mock reviews
const mockReviews: Review[] = [
  {
    id: 1,
    productId: 1, // Zen Master OG
    userId: 101,
    userName: "PandaLover420",
    rating: 5,
    comment: "Absolutely amazing! The perfect balance of relaxation and creativity. Will definitely order again.",
    isVerified: true,
    helpfulCount: 23,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    productId: 1, // Zen Master OG
    userId: 102,
    userName: "ZenSeeker",
    rating: 5,
    comment: "This strain lives up to its name. Perfect for meditation and finding inner peace.",
    isVerified: true,
    helpfulCount: 18,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: 3,
    productId: 1, // Zen Master OG
    userId: 103,
    userName: "GreenThumb",
    rating: 4,
    comment: "Great quality and fast shipping. The effects are exactly as described.",
    isVerified: true,
    helpfulCount: 12,
    createdAt: new Date("2024-01-05"),
  },
  {
    id: 4,
    productId: 2, // Panda Dream
    userId: 104,
    userName: "SleepyPanda",
    rating: 5,
    comment: "Best strain for sleep! Helps me unwind after stressful days.",
    isVerified: true,
    helpfulCount: 15,
    createdAt: new Date("2024-01-12"),
  },
  {
    id: 5,
    productId: 4, // Panda's Choice
    userId: 105,
    userName: "VapeEnthusiast",
    rating: 5,
    comment: "Smoothest vape I've ever tried. The flavor is incredible and the effects are perfect.",
    isVerified: true,
    helpfulCount: 27,
    createdAt: new Date("2024-01-08"),
  },
  {
    id: 6,
    productId: 4, // Panda's Choice
    userId: 106,
    userName: "CloudChaser",
    rating: 4,
    comment: "Great flavor and effects. Battery life could be better, but overall a great product.",
    isVerified: true,
    helpfulCount: 9,
    createdAt: new Date("2024-01-20"),
  },
]
