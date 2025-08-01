const { PrismaClient } = require('@prisma/client');
const { asyncHandler, AppError } = require('../middlewares/errorHandler');

const prisma = new PrismaClient();

/**
 * Get user's cart
 * @route GET /api/cart
 * @access Private
 */
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discountPrice: true,
          images: true,
          stockQuantity: true,
          isActive: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate cart totals
  let subtotal = 0;
  const validCartItems = cartItems.filter(item => {
    if (!item.product.isActive) return false;
    
    const price = item.product.discountPrice || item.product.price;
    subtotal += price * item.quantity;
    return true;
  });

  const tax = subtotal * 0.13; // 13% tax (adjust as needed)
  const total = subtotal + tax;

  res.json({
    status: 'success',
    data: {
      cartItems: validCartItems,
      summary: {
        itemCount: validCartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100
      }
    }
  });
});

/**
 * Add item to cart
 * @route POST /api/cart/add
 * @access Private
 */
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new AppError('Product ID is required', 400);
  }

  if (quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  // Check if product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product || !product.isActive) {
    throw new AppError('Product not found or inactive', 404);
  }

  // Check stock availability
  if (product.stockQuantity < quantity) {
    throw new AppError(`Only ${product.stockQuantity} items available in stock`, 400);
  }

  // Check if item already exists in cart
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  let cartItem;
  if (existingCartItem) {
    // Update quantity
    const newQuantity = existingCartItem.quantity + quantity;
    
    if (product.stockQuantity < newQuantity) {
      throw new AppError(`Only ${product.stockQuantity} items available in stock`, 400);
    }

    cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      data: { quantity: newQuantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discountPrice: true,
            images: true,
            stockQuantity: true
          }
        }
      }
    });
  } else {
    // Create new cart item
    cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discountPrice: true,
            images: true,
            stockQuantity: true
          }
        }
      }
    });
  }

  res.status(existingCartItem ? 200 : 201).json({
    status: 'success',
    message: existingCartItem ? 'Cart item updated' : 'Item added to cart',
    data: {
      cartItem
    }
  });
});

/**
 * Update cart item quantity
 * @route PUT /api/cart/update
 * @access Private
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new AppError('Product ID and quantity are required', 400);
  }

  if (quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  // Check if cart item exists
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    },
    include: {
      product: true
    }
  });

  if (!cartItem) {
    throw new AppError('Cart item not found', 404);
  }

  // Check stock availability
  if (cartItem.product.stockQuantity < quantity) {
    throw new AppError(`Only ${cartItem.product.stockQuantity} items available in stock`, 400);
  }

  const updatedCartItem = await prisma.cartItem.update({
    where: {
      userId_productId: {
        userId,
        productId
      }
    },
    data: { quantity },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discountPrice: true,
          images: true,
          stockQuantity: true
        }
      }
    }
  });

  res.json({
    status: 'success',
    message: 'Cart item updated',
    data: {
      cartItem: updatedCartItem
    }
  });
});

/**
 * Remove item from cart
 * @route DELETE /api/cart/remove/:productId
 * @access Private
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId);

  // Check if cart item exists
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (!cartItem) {
    throw new AppError('Cart item not found', 404);
  }

  await prisma.cartItem.delete({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  res.json({
    status: 'success',
    message: 'Item removed from cart'
  });
});

/**
 * Clear entire cart
 * @route DELETE /api/cart/clear
 * @access Private
 */
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await prisma.cartItem.deleteMany({
    where: { userId }
  });

  res.json({
    status: 'success',
    message: 'Cart cleared successfully'
  });
});

/**
 * Get cart item count
 * @route GET /api/cart/count
 * @access Private
 */
const getCartCount = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          isActive: true
        }
      }
    }
  });

  const count = cartItems
    .filter(item => item.product.isActive)
    .reduce((sum, item) => sum + item.quantity, 0);

  res.json({
    status: 'success',
    data: {
      count
    }
  });
});

/**
 * Validate cart before checkout
 * @route POST /api/cart/validate
 * @access Private
 */
const validateCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true
    }
  });

  if (cartItems.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  const validationErrors = [];
  const validItems = [];

  for (const item of cartItems) {
    if (!item.product.isActive) {
      validationErrors.push({
        productId: item.product.id,
        productName: item.product.name,
        error: 'Product is no longer available'
      });
      continue;
    }

    if (item.product.stockQuantity < item.quantity) {
      validationErrors.push({
        productId: item.product.id,
        productName: item.product.name,
        error: `Only ${item.product.stockQuantity} items available in stock`,
        requestedQuantity: item.quantity,
        availableQuantity: item.product.stockQuantity
      });
      continue;
    }

    validItems.push(item);
  }

  // Calculate totals for valid items
  let subtotal = 0;
  validItems.forEach(item => {
    const price = item.product.discountPrice || item.product.price;
    subtotal += price * item.quantity;
  });

  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  res.json({
    status: validationErrors.length > 0 ? 'warning' : 'success',
    message: validationErrors.length > 0 
      ? 'Some items in your cart have issues' 
      : 'Cart is valid for checkout',
    data: {
      validItems,
      validationErrors,
      summary: {
        itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100
      }
    }
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
  validateCart
};