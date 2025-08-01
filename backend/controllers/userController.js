const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { asyncHandler, AppError } = require('../middlewares/errorHandler');

const prisma = new PrismaClient();

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      dateOfBirth: true,
      isVerified: true,
      kycStatus: true,
      loyaltyPoints: true,
      walletBalance: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: {
      user
    }
  });
});

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, phone, dateOfBirth } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName,
      lastName,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      dateOfBirth: true,
      isVerified: true,
      kycStatus: true,
      loyaltyPoints: true,
      walletBalance: true,
      updatedAt: true
    }
  });

  res.json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
});

/**
 * Change password
 * @route PUT /api/users/change-password
 * @access Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash new password
  const saltRounds = 12;
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash }
  });

  res.json({
    status: 'success',
    message: 'Password changed successfully'
  });
});

/**
 * Get user addresses
 * @route GET /api/users/addresses
 * @access Private
 */
const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  res.json({
    status: 'success',
    data: {
      addresses
    }
  });
});

/**
 * Create new address
 * @route POST /api/users/addresses
 * @access Private
 */
const createAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    type,
    firstName,
    lastName,
    company,
    address1,
    address2,
    city,
    state,
    postalCode,
    country,
    phone,
    isDefault
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !address1 || !city || !state || !postalCode) {
    throw new AppError('Required address fields are missing', 400);
  }

  // If this is set as default, unset other default addresses
  if (isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
        type: type || 'shipping',
        isDefault: true
      },
      data: { isDefault: false }
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      type: type || 'shipping',
      firstName,
      lastName,
      company,
      address1,
      address2,
      city,
      state,
      postalCode,
      country: country || 'Canada',
      phone,
      isDefault: isDefault || false
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Address created successfully',
    data: {
      address
    }
  });
});

/**
 * Update address
 * @route PUT /api/users/addresses/:id
 * @access Private
 */
const updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addressId = parseInt(req.params.id);
  const updateData = req.body;

  // Check if address belongs to user
  const existingAddress = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId
    }
  });

  if (!existingAddress) {
    throw new AppError('Address not found', 404);
  }

  // If setting as default, unset other default addresses
  if (updateData.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
        type: updateData.type || existingAddress.type,
        isDefault: true,
        NOT: { id: addressId }
      },
      data: { isDefault: false }
    });
  }

  const updatedAddress = await prisma.address.update({
    where: { id: addressId },
    data: updateData
  });

  res.json({
    status: 'success',
    message: 'Address updated successfully',
    data: {
      address: updatedAddress
    }
  });
});

/**
 * Delete address
 * @route DELETE /api/users/addresses/:id
 * @access Private
 */
const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addressId = parseInt(req.params.id);

  // Check if address belongs to user
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId
    }
  });

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  await prisma.address.delete({
    where: { id: addressId }
  });

  res.json({
    status: 'success',
    message: 'Address deleted successfully'
  });
});

/**
 * Get user order history
 * @route GET /api/users/orders
 * @access Private
 */
const getOrderHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const whereClause = { userId };
  if (status) {
    whereClause.status = status;
  }

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                slug: true
              }
            }
          }
        },
        shippingAddress: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.order.count({ where: whereClause })
  ]);

  res.json({
    status: 'success',
    data: {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    }
  });
});

/**
 * Get loyalty points history
 * @route GET /api/users/loyalty
 * @access Private
 */
const getLoyaltyHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [transactions, totalCount] = await Promise.all([
    prisma.loyaltyTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.loyaltyTransaction.count({ where: { userId } })
  ]);

  res.json({
    status: 'success',
    data: {
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    }
  });
});

/**
 * Get user wishlist
 * @route GET /api/users/wishlist
 * @access Private
 */
const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: {
            select: { name: true, slug: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({
    status: 'success',
    data: {
      wishlist: wishlistItems
    }
  });
});

/**
 * Add to wishlist
 * @route POST /api/users/wishlist
 * @access Private
 */
const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    throw new AppError('Product ID is required', 400);
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check if already in wishlist
  const existingItem = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (existingItem) {
    throw new AppError('Product already in wishlist', 400);
  }

  const wishlistItem = await prisma.wishlist.create({
    data: {
      userId,
      productId
    },
    include: {
      product: true
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Product added to wishlist',
    data: {
      wishlistItem
    }
  });
});

/**
 * Remove from wishlist
 * @route DELETE /api/users/wishlist/:productId
 * @access Private
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId);

  const wishlistItem = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (!wishlistItem) {
    throw new AppError('Product not in wishlist', 404);
  }

  await prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  res.json({
    status: 'success',
    message: 'Product removed from wishlist'
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getOrderHistory,
  getLoyaltyHistory,
  getWishlist,
  addToWishlist,
  removeFromWishlist
};