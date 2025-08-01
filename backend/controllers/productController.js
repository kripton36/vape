const { PrismaClient } = require('@prisma/client');
const { asyncHandler, AppError } = require('../middlewares/errorHandler');

const prisma = new PrismaClient();

/**
 * Get all products with filtering, sorting, and pagination
 * @route GET /api/products
 * @access Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    minPrice,
    maxPrice,
    strainType,
    featured,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build where clause
  const whereClause = {
    isActive: true
  };

  if (category) {
    whereClause.category = {
      slug: category
    };
  }

  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price.gte = parseFloat(minPrice);
    if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
  }

  if (strainType) {
    whereClause.strainType = strainType;
  }

  if (featured === 'true') {
    whereClause.isFeatured = true;
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Build orderBy clause
  const orderBy = {};
  orderBy[sortBy] = sortOrder;

  const [products, totalCount, categories] = await Promise.all([
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
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy,
      skip,
      take: parseInt(limit)
    }),
    prisma.product.count({ where: whereClause }),
    prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })
  ]);

  // Calculate average rating for each product
  const productsWithRating = products.map(product => {
    const ratings = product.reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    return {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: ratings.length,
      reviews: undefined // Remove detailed reviews from response
    };
  });

  res.json({
    status: 'success',
    data: {
      products: productsWithRating,
      categories,
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
 * Get single product by ID or slug
 * @route GET /api/products/:identifier
 * @access Public
 */
const getProduct = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  
  // Check if identifier is a number (ID) or string (slug)
  const isId = !isNaN(parseInt(identifier));
  const whereClause = isId 
    ? { id: parseInt(identifier), isActive: true }
    : { slug: identifier, isActive: true };

  const product = await prisma.product.findFirst({
    where: whereClause,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Calculate average rating
  const ratings = product.reviews.map(review => review.rating);
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
    : 0;

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      discountPrice: true,
      images: true,
      isFeatured: true
    },
    take: 4
  });

  const productWithDetails = {
    ...product,
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: ratings.length,
    relatedProducts
  };

  res.json({
    status: 'success',
    data: {
      product: productWithDetails
    }
  });
});

/**
 * Get products by category
 * @route GET /api/products/category/:categoryId
 * @access Public
 */
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Check if category exists
  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { id: parseInt(categoryId) || 0 },
        { slug: categoryId }
      ],
      isActive: true
    }
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  const orderBy = {};
  orderBy[sortBy] = sortOrder;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: category.id,
        isActive: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy,
      skip,
      take: parseInt(limit)
    }),
    prisma.product.count({
      where: {
        categoryId: category.id,
        isActive: true
      }
    })
  ]);

  // Calculate average rating for each product
  const productsWithRating = products.map(product => {
    const ratings = product.reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    return {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: ratings.length,
      reviews: undefined
    };
  });

  res.json({
    status: 'success',
    data: {
      category,
      products: productsWithRating,
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
 * Search products
 * @route GET /api/products/search
 * @access Public
 */
const searchProducts = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 12 } = req.query;

  if (!q) {
    throw new AppError('Search query is required', 400);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { strainType: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      skip,
      take: parseInt(limit)
    }),
    prisma.product.count({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { strainType: { contains: q, mode: 'insensitive' } }
        ]
      }
    })
  ]);

  const productsWithRating = products.map(product => {
    const ratings = product.reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    return {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: ratings.length,
      reviews: undefined
    };
  });

  res.json({
    status: 'success',
    data: {
      products: productsWithRating,
      searchQuery: q,
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
 * Get featured products
 * @route GET /api/products/featured
 * @access Public
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      reviews: {
        select: {
          rating: true
        }
      }
    },
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' }
  });

  const productsWithRating = products.map(product => {
    const ratings = product.reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    return {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: ratings.length,
      reviews: undefined
    };
  });

  res.json({
    status: 'success',
    data: {
      products: productsWithRating
    }
  });
});

/**
 * Get all categories
 * @route GET /api/products/categories
 * @access Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true }
          }
        }
      }
    },
    orderBy: { sortOrder: 'asc' }
  });

  res.json({
    status: 'success',
    data: {
      categories
    }
  });
});

/**
 * Add/Update product review
 * @route POST /api/products/:id/review
 * @access Private
 */
const addReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const productId = parseInt(req.params.id);
  const { rating, title, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check if user has already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  let review;
  if (existingReview) {
    // Update existing review
    review = await prisma.review.update({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      data: {
        rating,
        title,
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  } else {
    // Create new review
    review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  res.status(existingReview ? 200 : 201).json({
    status: 'success',
    message: existingReview ? 'Review updated successfully' : 'Review added successfully',
    data: {
      review
    }
  });
});

module.exports = {
  getProducts,
  getProduct,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
  getCategories,
  addReview
};