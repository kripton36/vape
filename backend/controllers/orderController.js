const { PrismaClient } = require('@prisma/client');
const { asyncHandler, AppError } = require('../middlewares/errorHandler');

const prisma = new PrismaClient();

/**
 * Generate order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GP-${timestamp.slice(-6)}-${random}`;
};

/**
 * Create new order
 * @route POST /api/orders
 * @access Private
 */
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    shippingAddressId,
    billingAddressId,
    paymentMethod,
    notes
  } = req.body;

  if (!shippingAddressId) {
    throw new AppError('Shipping address is required', 400);
  }

  // Get user's cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true
    }
  });

  if (cartItems.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // Validate cart items and calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of cartItems) {
    if (!item.product.isActive) {
      throw new AppError(`Product ${item.product.name} is no longer available`, 400);
    }

    if (item.product.stockQuantity < item.quantity) {
      throw new AppError(
        `Insufficient stock for ${item.product.name}. Only ${item.product.stockQuantity} available`,
        400
      );
    }

    const unitPrice = item.product.discountPrice || item.product.price;
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;

    orderItems.push({
      productId: item.product.id,
      quantity: item.quantity,
      unitPrice,
      totalPrice
    });
  }

  // Calculate tax and shipping
  const taxAmount = subtotal * 0.13; // 13% tax
  const shippingCost = subtotal >= 50 ? 0 : 9.99; // Free shipping over $50
  const totalAmount = subtotal + taxAmount + shippingCost;

  // Verify addresses belong to user
  const shippingAddress = await prisma.address.findFirst({
    where: { id: shippingAddressId, userId }
  });

  if (!shippingAddress) {
    throw new AppError('Invalid shipping address', 400);
  }

  let billingAddress = shippingAddress;
  if (billingAddressId && billingAddressId !== shippingAddressId) {
    billingAddress = await prisma.address.findFirst({
      where: { id: billingAddressId, userId }
    });
    if (!billingAddress) {
      throw new AppError('Invalid billing address', 400);
    }
  }

  // Create order in transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        userId,
        orderNumber: generateOrderNumber(),
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        shippingAddressId,
        billingAddressId: billingAddressId.id,
        subtotal,
        taxAmount,
        shippingCost,
        totalAmount,
        notes,
        orderItems: {
          create: orderItems
        }
      },
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
      }
    });

    // Update product stock quantities
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.product.id },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      });
    }

    // Clear user's cart
    await tx.cartItem.deleteMany({
      where: { userId }
    });

    // Add order tracking entry
    await tx.orderTracking.create({
      data: {
        orderId: newOrder.id,
        status: 'pending',
        notes: 'Order placed successfully'
      }
    });

    // Award loyalty points (1 point per dollar spent)
    const pointsEarned = Math.floor(totalAmount);
    await tx.user.update({
      where: { id: userId },
      data: {
        loyaltyPoints: {
          increment: pointsEarned
        }
      }
    });

    // Record loyalty transaction
    await tx.loyaltyTransaction.create({
      data: {
        userId,
        type: 'earned',
        points: pointsEarned,
        description: `Points earned from order ${newOrder.orderNumber}`,
        orderId: newOrder.id
      }
    });

    return newOrder;
  });

  res.status(201).json({
    status: 'success',
    message: 'Order created successfully',
    data: {
      order
    }
  });
});

/**
 * Get user orders
 * @route GET /api/orders
 * @access Private
 */
const getOrders = asyncHandler(async (req, res) => {
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
        shippingAddress: true,
        orderTracking: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
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
 * Get single order
 * @route GET /api/orders/:id
 * @access Private
 */
const getOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orderId = parseInt(req.params.id);

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              slug: true,
              price: true,
              discountPrice: true
            }
          }
        }
      },
      shippingAddress: true,
      orderTracking: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * Cancel order
 * @route PUT /api/orders/:id/cancel
 * @access Private
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orderId = parseInt(req.params.id);
  const { reason } = req.body;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    },
    include: {
      orderItems: true
    }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (!['pending', 'confirmed'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled at this stage', 400);
  }

  // Update order in transaction
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // Update order status
    const cancelledOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
        paymentStatus: 'cancelled'
      }
    });

    // Restore product stock quantities
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            increment: item.quantity
          }
        }
      });
    }

    // Add tracking entry
    await tx.orderTracking.create({
      data: {
        orderId,
        status: 'cancelled',
        notes: reason || 'Order cancelled by customer'
      }
    });

    // Reverse loyalty points if any were awarded
    const pointsToReverse = Math.floor(order.totalAmount);
    await tx.user.update({
      where: { id: userId },
      data: {
        loyaltyPoints: {
          decrement: pointsToReverse
        }
      }
    });

    // Record loyalty transaction
    await tx.loyaltyTransaction.create({
      data: {
        userId,
        type: 'redeemed',
        points: pointsToReverse,
        description: `Points reversed for cancelled order ${order.orderNumber}`,
        orderId
      }
    });

    return cancelledOrder;
  });

  res.json({
    status: 'success',
    message: 'Order cancelled successfully',
    data: {
      order: updatedOrder
    }
  });
});

/**
 * Reorder (add order items to cart)
 * @route POST /api/orders/:id/reorder
 * @access Private
 */
const reorderItems = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orderId = parseInt(req.params.id);

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const addedItems = [];
  const unavailableItems = [];

  for (const orderItem of order.orderItems) {
    const product = orderItem.product;

    // Check if product is still active and available
    if (!product.isActive) {
      unavailableItems.push({
        productName: product.name,
        reason: 'Product no longer available'
      });
      continue;
    }

    if (product.stockQuantity < orderItem.quantity) {
      unavailableItems.push({
        productName: product.name,
        reason: `Only ${product.stockQuantity} items available in stock`
      });
      continue;
    }

    // Add to cart or update existing cart item
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: product.id
        }
      }
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + orderItem.quantity;
      if (product.stockQuantity >= newQuantity) {
        await prisma.cartItem.update({
          where: {
            userId_productId: {
              userId,
              productId: product.id
            }
          },
          data: { quantity: newQuantity }
        });
        addedItems.push(product.name);
      } else {
        unavailableItems.push({
          productName: product.name,
          reason: 'Insufficient stock for requested quantity'
        });
      }
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: product.id,
          quantity: orderItem.quantity
        }
      });
      addedItems.push(product.name);
    }
  }

  res.json({
    status: 'success',
    message: 'Items processed for reorder',
    data: {
      addedItems,
      unavailableItems,
      addedCount: addedItems.length,
      unavailableCount: unavailableItems.length
    }
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
  reorderItems
};