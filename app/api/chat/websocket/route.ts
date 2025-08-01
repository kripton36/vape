import { NextRequest } from 'next/server'
import { WebSocket, WebSocketServer } from 'ws'
import { createServer } from 'http'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

interface ChatMessage {
  id: string
  sessionId: string
  senderType: 'customer' | 'admin' | 'system'
  senderId: string
  senderName: string
  message: string
  timestamp: Date
  messageType: 'text' | 'image' | 'file' | 'system'
}

interface ChatSession {
  id: string
  userId?: string
  customerName: string
  customerEmail: string
  status: 'waiting' | 'active' | 'resolved' | 'closed'
  priority: 'high' | 'normal' | 'low'
  assignedAdminId?: string
  createdAt: Date
  updatedAt: Date
}

// Store active WebSocket connections
const activeConnections = new Map<string, WebSocket>()
const activeSessions = new Map<string, ChatSession>()

// Verify JWT token
function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded
  } catch {
    return null
  }
}

// Generate unique session ID
function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substring(2) + '_' + Date.now()
}

// Send message to specific connection
function sendToConnection(connectionId: string, message: any) {
  const connection = activeConnections.get(connectionId)
  if (connection && connection.readyState === WebSocket.OPEN) {
    connection.send(JSON.stringify(message))
  }
}

// Broadcast message to all admins
function broadcastToAdmins(message: any) {
  activeConnections.forEach((connection, connectionId) => {
    if (connectionId.startsWith('admin_')) {
      sendToConnection(connectionId, message)
    }
  })
}

// Handle incoming WebSocket connections
export async function GET(request: NextRequest) {
  // Note: This is a simplified WebSocket implementation
  // In production, you would use a proper WebSocket server
  
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const sessionId = searchParams.get('sessionId')
  
  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }

  const user = verifyToken(token)
  if (!user) {
    return new Response('Invalid token', { status: 401 })
  }

  // This would normally establish a WebSocket connection
  // For the API route format, we'll return connection details
  return Response.json({
    success: true,
    message: 'WebSocket connection endpoint ready',
    connectionId: user.role === 'admin' ? `admin_${user.userId}` : `user_${user.userId}`,
    sessionId: sessionId || generateSessionId()
  })
}

// Handle chat message sending
export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, messageType = 'text' } = await request.json()
    
    // Get auth header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!sessionId || !message) {
      return Response.json({ error: 'Session ID and message are required' }, { status: 400 })
    }

    // Create chat message
    const chatMessage: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2) + '_' + Date.now(),
      sessionId,
      senderType: user.role === 'admin' ? 'admin' : 'customer',
      senderId: user.userId,
      senderName: user.role === 'admin' ? 'Support Agent' : 'Customer',
      message,
      timestamp: new Date(),
      messageType
    }

    // TODO: Save message to database
    // await chatQueries.saveMessage(chatMessage)

    // Send message to relevant connections
    if (user.role === 'admin') {
      // Admin sending message - send to customer
      const customerConnectionId = `user_${sessionId.split('_')[1]}`
      sendToConnection(customerConnectionId, {
        type: 'message',
        data: chatMessage
      })
    } else {
      // Customer sending message - send to assigned admin or all admins
      const session = activeSessions.get(sessionId)
      if (session?.assignedAdminId) {
        const adminConnectionId = `admin_${session.assignedAdminId}`
        sendToConnection(adminConnectionId, {
          type: 'message',
          data: chatMessage
        })
      } else {
        // Broadcast to all admins if no specific admin assigned
        broadcastToAdmins({
          type: 'new_message',
          data: chatMessage
        })
      }
    }

    return Response.json({
      success: true,
      data: chatMessage
    })
  } catch (error) {
    console.error('Chat message error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle session management
export async function PUT(request: NextRequest) {
  try {
    const { sessionId, action, adminId } = await request.json()
    
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 })
    }

    if (!sessionId || !action) {
      return Response.json({ error: 'Session ID and action are required' }, { status: 400 })
    }

    const session = activeSessions.get(sessionId)
    if (!session) {
      return Response.json({ error: 'Session not found' }, { status: 404 })
    }

    switch (action) {
      case 'assign':
        session.assignedAdminId = adminId || user.userId
        session.status = 'active'
        session.updatedAt = new Date()
        
        // Notify customer that admin joined
        const customerConnectionId = `user_${sessionId.split('_')[1]}`
        sendToConnection(customerConnectionId, {
          type: 'admin_joined',
          data: {
            adminName: 'Support Agent',
            sessionId
          }
        })
        break
        
      case 'close':
        session.status = 'closed'
        session.updatedAt = new Date()
        
        // Notify customer that session is closed
        sendToConnection(`user_${sessionId.split('_')[1]}`, {
          type: 'session_closed',
          data: { sessionId }
        })
        break
        
      case 'resolve':
        session.status = 'resolved'
        session.updatedAt = new Date()
        break
    }

    activeSessions.set(sessionId, session)

    // TODO: Update session in database
    // await chatQueries.updateSession(sessionId, session)

    return Response.json({
      success: true,
      data: session
    })
  } catch (error) {
    console.error('Session management error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}