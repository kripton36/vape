const { PrismaClient } = require('@prisma/client');
const { asyncHandler, AppError } = require('../middlewares/errorHandler');

const prisma = new PrismaClient();

/**
 * Get dashboard overview stats
 * @route GET /api/admin/stats/overview
 * @access Private (Admin)
 */
const getOverviewStats = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query; // days
  const days = parseInt(period);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    newUsers,
    newOrders,
    pendingOrders,
    lowStockProducts
  ] = await Promise.all([
    // Total users
    prisma.user.count(),
    
    // Total active products
    prisma.product.count({
      where: { isActive: true }
    }),
    
    // Total orders
    prisma.order.count(),
    
    // Total revenue
    prisma.order.aggregate({
      where: {
        paymentStatus: 'completed'
      },
      _sum: {
        totalAmount: true
      }
    }),
    
    // New users in period
    prisma.user.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    }),
    
    // New orders in period
    prisma.order.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    }),
    
    // Pending orders
    prisma.order.count({
      where: {
        status: 'pending'
      }
    }),
    
    // Low stock products (less than 10)
    prisma.product.count({
      where: {
        stockQuantity: {
          lt: 10
        },
        isActive: true
      }
    })
  ]);

  res.json({
    status: 'success',
    data: {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        newUsers,
        newOrders,
        pendingOrders,
        lowStockProducts
      },
      period: days
    }
  });
});

/**
 * Get sales analytics
 * @route GET /api/admin/stats/sales
 * @access Private (Admin)
 */
const getSalesStats = asyncHandler(async (req, res) => {
  const { period = '30', groupBy = 'day' } = req.query;
  const days = parseInt(period);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Daily sales data
  const salesData = await prisma.$queryRaw`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as orders,
      SUM(total_amount) as revenue,
      AVG(total_amount) as avg_order_value
    FROM orders 
    WHERE created_at >= ${startDate}
      AND payment_status = 'completed'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  // Top selling products
  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      order: {
        createdAt: {
          gte: startDate
        },
        paymentStatus: 'completed'
      }
    },
    _sum: {
      quantity: true,
      totalPrice: true
    },
    _count: {
      _all: true
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: 10
  });

  // Get product details for top products
  const productIds = topProducts.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds
      }
    },
    select: {
      id: true,
      name: true,
      images: true,
      price: true
    }
  });

  const topProductsWithDetails = topProducts.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      product,
      quantitySold: item._sum.quantity,
      revenue: item._sum.totalPrice,
      orderCount: item._count._all
    };
  });

  // Sales by category
  const categoryStats = await prisma.$queryRaw`
    SELECT 
      c.name as category_name,
      c.id as category_id,
      SUM(oi.quantity) as total_quantity,
      SUM(oi.total_price) as total_revenue,
      COUNT(DISTINCT oi.order_id) as order_count
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.created_at >= ${startDate}
      AND o.payment_status = 'completed'
    GROUP BY c.id, c.name
    ORDER BY total_revenue DESC
  `;

  res.json({
    status: 'success',
    data: {
      salesData,
      topProducts: topProductsWithDetails,
      categoryStats,
      period: days
    }
  });
});

/**
 * Get user analytics
 * @route GET /api/admin/stats/users
 * @access Private (Admin)
 */
const getUserStats = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const days = parseInt(period);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // User registration trend
  const userGrowth = await prisma.$queryRaw`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as new_users
    FROM users 
    WHERE created_at >= ${startDate}
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  // User engagement stats
  const [
    activeUsers,
    verifiedUsers,
    usersWithOrders,
    averageOrderValue,
    topCustomers
  ] = await Promise.all([
    // Active users (users with orders in period)
    prisma.user.count({
      where: {
        orders: {
          some: {
            createdAt: {
              gte: startDate
            }
          }
        }
      }
    }),
    
    // Verified users
    prisma.user.count({
      where: { isVerified: true }
    }),
    
    // Users with at least one order
    prisma.user.count({
      where: {
        orders: {
          some: {}
        }
      }
    }),
    
    // Average order value
    prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startDate
        },
        paymentStatus: 'completed'
      },
      _avg: {
        totalAmount: true
      }
    }),
    
    // Top customers by spending
    prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        _count: {
          select: {
            orders: {
              where: {
                paymentStatus: 'completed'
              }
            }
          }
        },
        orders: {
          where: {
            paymentStatus: 'completed'
          },
          select: {
            totalAmount: true
          }
        }
      },
      take: 10
    })
  ]);

  // Calculate total spending for top customers
  const topCustomersWithSpending = topCustomers.map(user => {
    const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
      email: user.email,
      orderCount: user._count.orders,
      totalSpent
    };
  }).sort((a, b) => b.totalSpent - a.totalSpent);

  res.json({
    status: 'success',
    data: {
      userGrowth,
      stats: {
        activeUsers,
        verifiedUsers,
        usersWithOrders,
        averageOrderValue: averageOrderValue._avg.totalAmount || 0
      },
      topCustomers: topCustomersWithSpending,
      period: days
    }
  });
});

/**
 * Get inventory stats
 * @route GET /api/admin/stats/inventory
 * @access Private (Admin)
 */
const getInventoryStats = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    activeProducts,
    outOfStockProducts,
    lowStockProducts,
    categoryDistribution,
    recentlyAdded
  ] = await Promise.all([
    // Total products
    prisma.product.count(),
    
    // Active products
    prisma.product.count({
      where: { isActive: true }
    }),
    
    // Out of stock products
    prisma.product.count({
      where: {
        stockQuantity: 0,
        isActive: true
      }
    }),
    
    // Low stock products (less than 10)
    prisma.product.findMany({
      where: {
        stockQuantity: {
          lt: 10,
          gt: 0
        },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        price: true,
        images: true
      },
      orderBy: {
        stockQuantity: 'asc'
      },
      take: 20
    }),
    
    // Products by category
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      }
    }),
    
    // Recently added products
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
        createdAt: true,
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })
  ]);

  res.json({
    status: 'success',
    data: {
      overview: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts,
      categoryDistribution,
      recentlyAdded
    }
  });
});

/**
 * Get order analytics
 * @route GET /api/admin/stats/orders
 * @access Private (Admin)
 */
const getOrderStats = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const days = parseInt(period);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Order status distribution
  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    where: {
      createdAt: {
        gte: startDate
      }
    },
    _count: {
      _all: true
    },
    _sum: {
      totalAmount: true
    }
  });

  // Payment status distribution
  const ordersByPaymentStatus = await prisma.order.groupBy({
    by: ['paymentStatus'],
    where: {
      createdAt: {
        gte: startDate
      }
    },
    _count: {
      _all: true
    },
    _sum: {
      totalAmount: true
    }
  });

  // Recent orders
  const recentOrders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      orderItems: {
        select: {
          quantity: true,
          product: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 20
  });

  // Average order processing time
  const completedOrders = await prisma.order.findMany({
    where: {
      status: 'completed',
      createdAt: {
        gte: startDate
      }
    },
    select: {
      createdAt: true,
      updatedAt: true
    }
  });

  const avgProcessingTime = completedOrders.length > 0
    ? completedOrders.reduce((sum, order) => {
        const diff = new Date(order.updatedAt) - new Date(order.createdAt);
        return sum + diff;
      }, 0) / completedOrders.length
    : 0;

  res.json({
    status: 'success',
    data: {
      ordersByStatus,
      ordersByPaymentStatus,
      recentOrders,
      avgProcessingTimeHours: Math.round(avgProcessingTime / (1000 * 60 * 60) * 100) / 100,
      period: days
    }
  });
});

module.exports = {
  getOverviewStats,
  getSalesStats,
  getUserStats,
  getInventoryStats,
  getOrderStats
};