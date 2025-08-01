const { authenticateAdmin } = require('./auth');

// Check if admin has specific permission
const checkPermission = (permission) => {
  return (req, res, next) => {
    const admin = req.admin;
    
    // Super admin has all permissions
    if (admin.role === 'super_admin') {
      return next();
    }
    
    // Check if admin has the required permission
    if (admin.permissions && admin.permissions[permission]) {
      return next();
    }
    
    return res.status(403).json({
      status: 'error',
      message: `Access denied. ${permission} permission required.`
    });
  };
};

// Admin role hierarchy middleware
const requireRole = (requiredRole) => {
  const roleHierarchy = {
    'support': 1,
    'admin': 2,
    'super_admin': 3
  };
  
  return (req, res, next) => {
    const admin = req.admin;
    const adminLevel = roleHierarchy[admin.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    if (adminLevel >= requiredLevel) {
      return next();
    }
    
    return res.status(403).json({
      status: 'error',
      message: `Access denied. ${requiredRole} role or higher required.`
    });
  };
};

// Combine admin auth with permission check
const adminWithPermission = (permission) => {
  return [authenticateAdmin, checkPermission(permission)];
};

// Combine admin auth with role check
const adminWithRole = (role) => {
  return [authenticateAdmin, requireRole(role)];
};

// Default admin permissions for different roles
const DEFAULT_PERMISSIONS = {
  support: {
    view_orders: true,
    view_users: true,
    update_order_status: true,
    view_products: true
  },
  admin: {
    view_orders: true,
    view_users: true,
    update_order_status: true,
    view_products: true,
    create_products: true,
    update_products: true,
    view_analytics: true,
    manage_categories: true
  },
  super_admin: {
    view_orders: true,
    view_users: true,
    update_order_status: true,
    view_products: true,
    create_products: true,
    update_products: true,
    delete_products: true,
    view_analytics: true,
    manage_categories: true,
    manage_admins: true,
    system_settings: true
  }
};

module.exports = {
  checkPermission,
  requireRole,
  adminWithPermission,
  adminWithRole,
  DEFAULT_PERMISSIONS
};