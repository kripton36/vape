export type PromoCode = {
  id: number
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minOrderValue?: number
  maxDiscountAmount?: number
  isActive: boolean
  usageLimit?: number
  usageCount: number
  userUsageLimit?: number
  startsAt?: Date
  expiresAt?: Date
}

// Promo code service
export const promoService = {
  // Validate a promo code
  async validatePromoCode(
    code: string,
    orderTotal: number,
    userId?: number,
  ): Promise<{
    valid: boolean
    promoCode?: PromoCode
    discountAmount?: number
    message?: string
  }> {
    try {
      // In a real app, this would check the database
      // For now, we'll use mock data
      const promoCode = mockPromoCodes.find((p) => p.code === code.toUpperCase())

      if (!promoCode) {
        return { valid: false, message: "Invalid promo code" }
      }

      if (!promoCode.isActive) {
        return { valid: false, message: "This promo code is inactive" }
      }

      if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
        return { valid: false, message: "This promo code has expired" }
      }

      if (promoCode.startsAt && new Date() < promoCode.startsAt) {
        return { valid: false, message: "This promo code is not yet active" }
      }

      if (promoCode.minOrderValue && orderTotal < promoCode.minOrderValue) {
        return {
          valid: false,
          message: `This promo code requires a minimum order of $${promoCode.minOrderValue.toFixed(2)}`,
        }
      }

      if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
        return { valid: false, message: "This promo code has reached its usage limit" }
      }

      // Calculate discount amount
      let discountAmount = 0
      if (promoCode.discountType === "percentage") {
        discountAmount = orderTotal * (promoCode.discountValue / 100)
        if (promoCode.maxDiscountAmount && discountAmount > promoCode.maxDiscountAmount) {
          discountAmount = promoCode.maxDiscountAmount
        }
      } else {
        discountAmount = promoCode.discountValue
      }

      return {
        valid: true,
        promoCode,
        discountAmount,
        message:
          promoCode.discountType === "percentage"
            ? `${promoCode.discountValue}% discount applied`
            : `$${promoCode.discountValue.toFixed(2)} discount applied`,
      }
    } catch (error) {
      console.error(`Validate promo code ${code} error:`, error)
      return { valid: false, message: "Error validating promo code" }
    }
  },

  // Record promo code usage
  async recordPromoCodeUsage(
    promoId: number,
    userId?: number,
    orderId?: number,
    discountAmount?: number,
  ): Promise<boolean> {
    try {
      // In a real app, this would update the database
      return true
    } catch (error) {
      console.error(`Record promo code ${promoId} usage error:`, error)
      return false
    }
  },
}

// Mock promo codes
const mockPromoCodes: PromoCode[] = [
  {
    id: 1,
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 0,
    maxDiscountAmount: 50,
    isActive: true,
    usageLimit: 1000,
    usageCount: 450,
    userUsageLimit: 1,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    id: 2,
    code: "PANDA20",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 100,
    maxDiscountAmount: 100,
    isActive: true,
    usageLimit: 500,
    usageCount: 320,
    userUsageLimit: 1,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
  },
  {
    id: 3,
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 8.99,
    minOrderValue: 50,
    isActive: true,
    usageLimit: undefined,
    usageCount: 789,
    userUsageLimit: undefined,
  },
  {
    id: 4,
    code: "SUMMER25",
    discountType: "percentage",
    discountValue: 25,
    minOrderValue: 75,
    maxDiscountAmount: 150,
    isActive: true,
    usageLimit: 300,
    usageCount: 298,
    userUsageLimit: 1,
    expiresAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Expired 30 days ago
  },
]
