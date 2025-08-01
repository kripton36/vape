const express = require('express');
const { PrismaClient } = require('@prisma/client');
const {
  getOverviewStats,
  getSalesStats,
  getUserStats,
  getInventoryStats,
  getOrderStats
} = require('../controllers/adminStatsController');
const { authenticateAdmin } = require('../middlewares/auth');
const { adminWithPermission } = require('../middlewares/admin');
const { asyncHandler, AppError } = require('../middlewares/errorHandler');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require admin authentication
router.use(authenticateAdmin);

// Stats routes
router.get('/stats/overview', adminWithPermission('view_analytics'), getOverviewStats);
router.get('/stats/sales', adminWithPermission('view_analytics'), getSalesStats);
router.get('/stats/users', adminWithPermission('view_analytics'), getUserStats);
router.get('/stats/inventory', adminWithPermission('view_analytics'), getInventoryStats);
router.get('/stats/orders', adminWithPermission('view_analytics'), getOrderStats);

/**
 * Get all users
 * @route GET /api/admin/users
 * @access Private (Admin)
 */
router.get('/users', adminWithPermission('view_users'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const whereClause = {};
  
  if (search) {
    whereClause.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (status) {
    if (status === 'verified') {
      whereClause.isVerified = true;
    } else if (status === 'unverified') {
      whereClause.isVerified = false;
    }
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
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
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.user.count({ where: whereClause })
  ]);

  res.json({
    status: 'success',
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    }
  });
}));

/**
 * Get all orders
 * @route GET /api/admin/orders
 * @access Private (Admin)
 */
router.get('/orders', adminWithPermission('view_orders'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, paymentStatus, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const whereClause = {};
  
  if (status) {
    whereClause.status = status;
  }

  if (paymentStatus) {
    whereClause.paymentStatus = paymentStatus;
  }

  if (search) {
    whereClause.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } }
    ];
  }

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        orderItems: {
          select: {
            quantity: true,
            unitPrice: true,
            product: {
              select: {
                name: true
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
}));

/**
 * Update order status
 * @route PUT /api/admin/orders/:id/status
 * @access Private (Admin)
 */
router.put('/orders/:id/status', adminWithPermission('update_order_status'), asyncHandler(async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status, paymentStatus, notes } = req.body;

  if (!status && !paymentStatus) {
    throw new AppError('Status or payment status is required', 400);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const updateData = {};
  if (status) updateData.status = status;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  const updatedOrder = await prisma.$transaction(async (tx) => {
    // Update order
    const updated = await tx.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Add tracking entry
    await tx.orderTracking.create({
      data: {
        orderId,
        status: status || order.status,
        notes: notes || `Status updated by admin`
      }
    });

    return updated;
  });

  res.json({
    status: 'success',
    message: 'Order status updated successfully',
    data: {
      order: updatedOrder
    }
  });
}));

/**
 * Get all products (admin view)
 * @route GET /api/admin/products
 * @access Private (Admin)
 */
router.get('/products', adminWithPermission('view_products'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const whereClause = {};
  
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (category) {
    whereClause.category = {
      slug: category
    };
  }

  if (status === 'active') {
    whereClause.isActive = true;
  } else if (status === 'inactive') {
    whereClause.isActive = false;
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.product.count({ where: whereClause })
  ]);

  res.json({
    status: 'success',
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    }
  });
}));

/**
 * Create new product
 * @route POST /api/admin/products
 * @access Private (Admin)
 */
router.post('/products', adminWithPermission('create_products'), asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    categoryId,
    price,
    discountPrice,
    stockQuantity,
    sku,
    weight,
    thcContent,
    cbdContent,
    strainType,
    images,
    isFeatured
  } = req.body;

  if (!name || !categoryId || !price || !stockQuantity || !sku) {
    throw new AppError('Name, category, price, stock quantity, and SKU are required', 400);
  }

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    throw new AppError('Invalid category', 400);
  }

  // Check if SKU is unique
  const existingProduct = await prisma.product.findUnique({
    where: { sku }
  });

  if (existingProduct) {
    throw new AppError('SKU already exists', 400);
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      categoryId,
      price,
      discountPrice,
      stockQuantity,
      sku,
      weight,
      thcContent,
      cbdContent,
      strainType,
      images,
      isFeatured: isFeatured || false
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: {
      product
    }
  });
}));

/**
 * Update product
 * @route PUT /api/admin/products/:id
 * @access Private (Admin)
 */
router.put('/products/:id', adminWithPermission('update_products'), asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);
  const updateData = req.body;

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // If SKU is being updated, check for uniqueness
  if (updateData.sku && updateData.sku !== product.sku) {
    const existingProduct = await prisma.product.findUnique({
      where: { sku: updateData.sku }
    });

    if (existingProduct) {
      throw new AppError('SKU already exists', 400);
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: updateData,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  });

  res.json({
    status: 'success',
    message: 'Product updated successfully',
    data: {
      product: updatedProduct
    }
  });
}));

/**
 * Delete product
 * @route DELETE /api/admin/products/:id
 * @access Private (Admin)
 */
router.delete('/products/:id', adminWithPermission('delete_products'), asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Instead of hard delete, mark as inactive
  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false }
  });

  res.json({
    status: 'success',
    message: 'Product deleted successfully'
  });
}));

module.exports = router;