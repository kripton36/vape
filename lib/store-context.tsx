"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode, useCallback } from "react"

// Types
export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  points: number
  walletBalance: number // Added walletBalance
  avatar?: string
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  thc?: string
  cbd?: string
  effects?: string[]
  flavors?: string[]
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  isNew?: boolean
  isFeatured?: boolean
  slug: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  shippingAddress: any
  paymentMethod: string
}

// Store State
interface StoreState {
  user: User | null
  cart: CartItem[]
  wishlist: WishlistItem[]
  orders: Order[]
  products: Product[]
  isLoading: boolean
}

// Actions
type StoreAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_TO_WISHLIST"; payload: WishlistItem }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_USER_WALLET_BALANCE"; payload: number } // New action
  | { type: "UPDATE_USER_LOYALTY_POINTS"; payload: number } // New action

// Initial State
const initialState: StoreState = {
  user: null,
  cart: [],
  wishlist: [],
  orders: [],
  products: [],
  isLoading: false,
}

// Reducer
function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "SET_USER":
      // Ensure walletBalance is initialized when setting user
      if (action.payload && action.payload.walletBalance === undefined) {
        return { ...state, user: { ...action.payload, walletBalance: 0 } }
      }
      return { ...state, user: action.payload }

    case "ADD_TO_CART":
      const existingItem = state.cart.find((item) => item.productId === action.payload.productId)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        }
      }
      return { ...state, cart: [...state.cart, action.payload] }

    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) }

    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }

    case "CLEAR_CART":
      return { ...state, cart: [] }

    case "ADD_TO_WISHLIST":
      const existingWishlistItem = state.wishlist.find((item) => item.productId === action.payload.productId)
      if (existingWishlistItem) return state
      return { ...state, wishlist: [...state.wishlist, action.payload] }

    case "REMOVE_FROM_WISHLIST":
      return { ...state, wishlist: state.wishlist.filter((item) => item.id !== action.payload) }

    case "SET_PRODUCTS":
      return { ...state, products: action.payload }

    case "SET_ORDERS":
      return { ...state, orders: action.payload }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "UPDATE_USER_WALLET_BALANCE":
      if (!state.user) return state
      return {
        ...state,
        user: {
          ...state.user,
          walletBalance: state.user.walletBalance + action.payload,
        },
      }

    case "UPDATE_USER_LOYALTY_POINTS":
      if (!state.user) return state
      return {
        ...state,
        user: {
          ...state.user,
          points: state.user.points + action.payload,
        },
      }

    default:
      return state
  }
}

// Context
const StoreContext = createContext<{
  state: StoreState
  dispatch: React.Dispatch<StoreAction>
} | null>(null)

// Provider
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("zen-panda-cart")
      const savedWishlist = localStorage.getItem("zen-panda-wishlist")
      const savedUser = localStorage.getItem("zen-panda-user")

      if (savedCart) {
        const cart = JSON.parse(savedCart)
        cart.forEach((item: CartItem) => {
          dispatch({ type: "ADD_TO_CART", payload: item })
        })
      }

      if (savedWishlist) {
        const wishlist = JSON.parse(savedWishlist)
        wishlist.forEach((item: WishlistItem) => {
          dispatch({ type: "ADD_TO_WISHLIST", payload: item })
        })
      }

      if (savedUser) {
        const user = JSON.parse(savedUser)
        // Ensure walletBalance is initialized when loading from localStorage
        if (user && user.walletBalance === undefined) {
          user.walletBalance = 0
        }
        dispatch({ type: "SET_USER", payload: user })
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem("zen-panda-cart", JSON.stringify(state.cart))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [state.cart])

  useEffect(() => {
    try {
      localStorage.setItem("zen-panda-wishlist", JSON.stringify(state.wishlist))
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error)
    }
  }, [state.wishlist])

  useEffect(() => {
    try {
      if (state.user) {
        localStorage.setItem("zen-panda-user", JSON.stringify(state.user))
      } else {
        localStorage.removeItem("zen-panda-user")
      }
    } catch (error) {
      console.error("Error saving user to localStorage:", error)
    }
  }, [state.user])

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

// Hook
export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }

  const { state, dispatch } = context

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return state.wishlist.some((item) => item.productId === productId)
    },
    [state.wishlist],
  )

  const toggleWishlist = useCallback(
    (product: Product) => {
      if (isInWishlist(product.id)) {
        const wishlistItem = state.wishlist.find((item) => item.productId === product.id)
        if (wishlistItem) {
          dispatch({ type: "REMOVE_FROM_WISHLIST", payload: wishlistItem.id })
        }
      } else {
        const wishlistItem: WishlistItem = {
          id: `wishlist-${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        }
        dispatch({ type: "ADD_TO_WISHLIST", payload: wishlistItem })
      }
    },
    [dispatch, isInWishlist, state.wishlist],
  )

  const addToCart = useCallback(
    (product: Product, quantity = 1, variant?: string) => {
      const cartItem: CartItem = {
        id: `cart-${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        variant,
      }
      dispatch({ type: "ADD_TO_CART", payload: cartItem })
    },
    [dispatch],
  )

  const setUser = useCallback((user: User | null) => dispatch({ type: "SET_USER", payload: user }), [dispatch])
  const removeFromCart = useCallback((id: string) => dispatch({ type: "REMOVE_FROM_CART", payload: id }), [dispatch])
  const updateCartQuantity = useCallback(
    (id: string, quantity: number) => dispatch({ type: "UPDATE_CART_QUANTITY", payload: { id, quantity } }),
    [dispatch],
  )
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), [dispatch])
  const addToWishlist = useCallback(
    (item: WishlistItem) => dispatch({ type: "ADD_TO_WISHLIST", payload: item }),
    [dispatch],
  )
  const removeFromWishlist = useCallback(
    (id: string) => dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id }),
    [dispatch],
  )
  const setProducts = useCallback(
    (products: Product[]) => dispatch({ type: "SET_PRODUCTS", payload: products }),
    [dispatch],
  )
  const setOrders = useCallback((orders: Order[]) => dispatch({ type: "SET_ORDERS", payload: orders }), [dispatch])
  const setLoading = useCallback((loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading }), [dispatch])

  const updateUserWalletBalance = useCallback(
    (amount: number) => dispatch({ type: "UPDATE_USER_WALLET_BALANCE", payload: amount }),
    [dispatch],
  )
  const updateUserLoyaltyPoints = useCallback(
    (points: number) => dispatch({ type: "UPDATE_USER_LOYALTY_POINTS", payload: points }),
    [dispatch],
  )

  return {
    // State
    user: state.user,
    cart: state.cart,
    wishlist: state.wishlist,
    orders: state.orders,
    products: state.products,
    isLoading: state.isLoading,

    // Computed values
    cartCount: state.cart.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    wishlistCount: state.wishlist.length,

    // Actions
    setUser,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    setProducts,
    setOrders,
    setLoading,
    updateUserWalletBalance, // Export new action
    updateUserLoyaltyPoints, // Export new action
  }
}
