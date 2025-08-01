const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
  reorderItems
} = require('../controllers/orderController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.post('/:id/reorder', reorderItems);

module.exports = router;