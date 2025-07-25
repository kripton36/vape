// Global chat store for managing live chat state
import { create } from "zustand"
import { chatQueries } from "./database"

export interface ChatMessage {
  id: number
  session_id: string
  sender_type: "customer" | "admin" | "system"
  sender_id?: number
  sender_name?: string
  message_text: string
  message_type: "text" | "image" | "file" | "system"
  metadata?: any
  is_read: boolean
  created_at: string
}

export interface ChatSession {
  id: number
  session_id: string
  user_id?: number
  customer_name?: string
  customer_email?: string
  status: "active" | "waiting" | "resolved" | "closed"
  priority: "high" | "normal" | "low"
  assigned_admin_id?: number
  created_at: string
  updated_at: string
  closed_at?: string
  message_count?: number
  unread_count?: number
  last_message_at?: string
}

interface ChatStore {
  // Customer state
  isOpen: boolean
  currentSession: ChatSession | null
  messages: ChatMessage[]
  isConnected: boolean
  isTyping: boolean

  // Admin state
  adminSessions: ChatSession[]
  activeAdminSession: ChatSession | null
  adminMessages: { [sessionId: string]: ChatMessage[] }

  // Actions
  openChat: () => void
  closeChat: () => void
  setSession: (session: ChatSession) => void
  addMessage: (message: ChatMessage) => void
  setMessages: (messages: ChatMessage[]) => void
  setConnected: (connected: boolean) => void
  setTyping: (typing: boolean) => void

  // Admin actions
  setAdminSessions: (sessions: ChatSession[]) => void
  setActiveAdminSession: (session: ChatSession | null) => void
  setAdminMessages: (sessionId: string, messages: ChatMessage[]) => void
  addAdminMessage: (sessionId: string, message: ChatMessage) => void
  updateSessionStatus: (sessionId: string, status: ChatSession["status"]) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  isOpen: false,
  currentSession: null,
  messages: [],
  isConnected: false,
  isTyping: false,
  adminSessions: [],
  activeAdminSession: null,
  adminMessages: {},

  // Customer actions
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  setSession: (session) => set({ currentSession: session }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages) => set({ messages }),

  setConnected: (connected) => set({ isConnected: connected }),

  setTyping: (typing) => set({ isTyping: typing }),

  // Admin actions
  setAdminSessions: (sessions) => set({ adminSessions: sessions }),

  setActiveAdminSession: (session) => set({ activeAdminSession: session }),

  setAdminMessages: (sessionId, messages) =>
    set((state) => ({
      adminMessages: {
        ...state.adminMessages,
        [sessionId]: messages,
      },
    })),

  addAdminMessage: (sessionId, message) =>
    set((state) => ({
      adminMessages: {
        ...state.adminMessages,
        [sessionId]: [...(state.adminMessages[sessionId] || []), message],
      },
    })),

  updateSessionStatus: (sessionId, status) =>
    set((state) => ({
      adminSessions: state.adminSessions.map((session) =>
        session.session_id === sessionId ? { ...session, status } : session,
      ),
      activeAdminSession:
        state.activeAdminSession?.session_id === sessionId
          ? { ...state.activeAdminSession, status }
          : state.activeAdminSession,
    })),
}))

// Chat service functions
export const chatService = {
  async createSession(customerData: {
    user_id?: number
    customer_name?: string
    customer_email?: string
    priority?: "high" | "normal" | "low"
  }) {
    try {
      const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

      const session = await chatQueries.createSession({
        session_id: sessionId,
        user_id: customerData.user_id,
        customer_name: customerData.customer_name,
        customer_email: customerData.customer_email,
        priority: customerData.priority || "normal",
      })

      // Add welcome message
      await chatQueries.addMessage({
        session_id: sessionId,
        sender_type: "system",
        sender_name: "Green Panda Bot",
        message_text:
          "🐼 Welcome to Green Panda support! A zen master will be with you shortly. How can we help you achieve cannabis enlightenment today?",
        message_type: "system",
      })

      return session
    } catch (error) {
      console.error("Failed to create chat session:", error)
      throw error
    }
  },

  async sendMessage(
    sessionId: string,
    messageData: {
      sender_type: "customer" | "admin"
      sender_id?: number
      sender_name?: string
      message_text: string
      message_type?: "text" | "image" | "file"
      metadata?: any
    },
  ) {
    try {
      const message = await chatQueries.addMessage({
        session_id: sessionId,
        ...messageData,
      })

      // Update store
      const store = useChatStore.getState()
      if (messageData.sender_type === "customer" && store.currentSession?.session_id === sessionId) {
        store.addMessage(message)
      } else if (messageData.sender_type === "admin") {
        store.addAdminMessage(sessionId, message)
      }

      return message
    } catch (error) {
      console.error("Failed to send message:", error)
      throw error
    }
  },

  async loadMessages(sessionId: string, limit = 50, offset = 0) {
    try {
      const messages = await chatQueries.getMessages(sessionId, limit, offset)

      // Update store
      const store = useChatStore.getState()
      if (store.currentSession?.session_id === sessionId) {
        store.setMessages(messages)
      } else {
        store.setAdminMessages(sessionId, messages)
      }

      return messages
    } catch (error) {
      console.error("Failed to load messages:", error)
      throw error
    }
  },

  async loadAdminSessions() {
    try {
      const sessions = await chatQueries.getActiveSessions()

      // Update store
      const store = useChatStore.getState()
      store.setAdminSessions(sessions)

      return sessions
    } catch (error) {
      console.error("Failed to load admin sessions:", error)
      throw error
    }
  },

  async assignToAdmin(sessionId: string, adminId: number) {
    try {
      const session = await chatQueries.assignToAdmin(sessionId, adminId)

      // Add system message
      await chatQueries.addMessage({
        session_id: sessionId,
        sender_type: "system",
        sender_name: "Green Panda Bot",
        message_text: "🐼 A zen master has joined the conversation and is ready to help!",
        message_type: "system",
      })

      return session
    } catch (error) {
      console.error("Failed to assign session to admin:", error)
      throw error
    }
  },

  async closeSession(sessionId: string) {
    try {
      const session = await chatQueries.closeSession(sessionId)

      // Add system message
      await chatQueries.addMessage({
        session_id: sessionId,
        sender_type: "system",
        sender_name: "Green Panda Bot",
        message_text:
          "🐼 This conversation has been closed. Thank you for choosing Green Panda! May your journey be filled with zen and good vibes.",
        message_type: "system",
      })

      // Update store
      const store = useChatStore.getState()
      store.updateSessionStatus(sessionId, "closed")

      return session
    } catch (error) {
      console.error("Failed to close session:", error)
      throw error
    }
  },

  async markAsRead(sessionId: string, senderType: "customer" | "admin") {
    try {
      await chatQueries.markMessagesAsRead(sessionId, senderType)
    } catch (error) {
      console.error("Failed to mark messages as read:", error)
    }
  },
}

// WebSocket connection manager (for real-time updates)
export class ChatWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(sessionId: string, userType: "customer" | "admin") {
    try {
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"}/chat?session=${sessionId}&type=${userType}`
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log("🐼 Chat WebSocket connected")
        useChatStore.getState().setConnected(true)
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("🐼 Chat WebSocket disconnected")
        useChatStore.getState().setConnected(false)
        this.attemptReconnect(sessionId, userType)
      }

      this.ws.onerror = (error) => {
        console.error("🐼 Chat WebSocket error:", error)
      }
    } catch (error) {
      console.error("Failed to connect WebSocket:", error)
    }
  }

  private handleMessage(data: any) {
    const store = useChatStore.getState()

    switch (data.type) {
      case "new_message":
        if (data.message.sender_type === "customer" && store.currentSession?.session_id === data.message.session_id) {
          store.addMessage(data.message)
        } else if (data.message.sender_type === "admin") {
          store.addAdminMessage(data.message.session_id, data.message)
        }
        break

      case "typing_start":
        if (data.session_id === store.currentSession?.session_id) {
          store.setTyping(true)
        }
        break

      case "typing_stop":
        if (data.session_id === store.currentSession?.session_id) {
          store.setTyping(false)
        }
        break

      case "session_assigned":
        store.updateSessionStatus(data.session_id, "active")
        break

      case "session_closed":
        store.updateSessionStatus(data.session_id, "closed")
        break

      default:
        console.log("Unknown WebSocket message type:", data.type)
    }
  }

  private attemptReconnect(sessionId: string, userType: "customer" | "admin") {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`🐼 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

      setTimeout(() => {
        this.connect(sessionId, userType)
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error("🐼 Max reconnection attempts reached")
    }
  }

  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error("WebSocket is not connected")
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
