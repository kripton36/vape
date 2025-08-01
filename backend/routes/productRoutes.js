const express = require('express');
const {
  getProducts,
  getProduct,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
  getCategories,
  addReview
} = require('../controllers/productController');
const { authenticateToken, optionalAuth } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/search', searchProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:identifier', optionalAuth, getProduct);

// Protected routes
router.post('/:id/review', authenticateToken, addReview);

module.exports = router;