const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateTokenPair, verifyRefreshToken } = require('../utils/jwt');
const { asyncHandler, AppError } = require('../middlewares/errorHandler');

const prisma = new PrismaClient();

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      isVerified: true,
      kycStatus: true,
      loyaltyPoints: true,
      walletBalance: true,
      createdAt: true
    }
  });

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    type: 'user'
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user,
      ...tokens
    }
  });
});

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find user with password
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    type: 'user'
  });

  // Remove password hash from response
  const { passwordHash, ...userWithoutPassword } = user;

  res.json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      ...tokens
    }
  });
});

/**
 * Admin login
 * @route POST /api/auth/admin/login
 * @access Public
 */
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find admin user
  const adminUser = await prisma.adminUser.findUnique({
    where: { email }
  });

  if (!adminUser || !adminUser.isActive) {
    throw new AppError('Invalid credentials or account inactive', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update last login
  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: { lastLogin: new Date() }
  });

  // Generate tokens
  const tokens = generateTokenPair({
    userId: adminUser.id,
    email: adminUser.email,
    type: 'admin'
  });

  // Remove password hash from response
  const { passwordHash, ...adminWithoutPassword } = adminUser;

  res.json({
    status: 'success',
    message: 'Admin login successful',
    data: {
      admin: adminWithoutPassword,
      ...tokens
    }
  });
});

/**
 * Refresh access token
 * @route POST /api/auth/refresh
 * @access Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Check if user/admin still exists
  let user;
  if (decoded.type === 'admin') {
    user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, isActive: true }
    });
    if (!user || !user.isActive) {
      throw new AppError('Admin user not found or inactive', 401);
    }
  } else {
    user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true }
    });
    if (!user) {
      throw new AppError('User not found', 401);
    }
  }

  // Generate new tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    type: decoded.type
  });

  res.json({
    status: 'success',
    message: 'Token refreshed successfully',
    data: tokens
  });
});

/**
 * Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just send a success response
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

/**
 * Forgot password
 * @route POST /api/auth/forgot-password
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email }
  });

  // Always return success for security reasons
  res.json({
    status: 'success',
    message: 'If an account with that email exists, a password reset link has been sent'
  });

  // TODO: In a real application, generate reset token and send email
  if (user) {
    console.log(`Password reset requested for user: ${email}`);
    // Generate reset token, save to database, send email
  }
});

/**
 * Reset password
 * @route POST /api/auth/reset-password
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new AppError('Token and new password are required', 400);
  }

  // TODO: Verify reset token and update password
  // For now, just return success
  res.json({
    status: 'success',
    message: 'Password reset successfully'
  });
});

/**
 * Verify email
 * @route GET /api/auth/verify-email
 * @access Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new AppError('Verification token is required', 400);
  }

  // TODO: Verify email token and update user
  // For now, just return success
  res.json({
    status: 'success',
    message: 'Email verified successfully'
  });
});

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res.json({
    status: 'success',
    data: {
      user
    }
  });
});

module.exports = {
  register,
  login,
  adminLogin,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getMe
};