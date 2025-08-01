const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage for multer (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, and WebP files are allowed.'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

/**
 * Upload single image to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Cloudinary folder
 * @param {string} publicId - Optional public ID
 * @returns {Promise<Object>} - Upload result
 */
const uploadToCloudinary = (buffer, folder = 'green-panda', publicId = null) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto'
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file objects with buffer
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Array>} - Array of upload results
 */
const uploadMultipleToCloudinary = async (files, folder = 'green-panda') => {
  const uploadPromises = files.map(file => {
    return uploadToCloudinary(file.buffer, folder);
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<Object>} - Deletion result
 */
const deleteMultipleFromCloudinary = (publicIds) => {
  return cloudinary.api.delete_resources(publicIds);
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
const extractPublicId = (url) => {
  if (!url) return null;
  
  const matches = url.match(/\/v\d+\/(.+)\./);
  return matches ? matches[1] : null;
};

/**
 * Generate transformation URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Transformation options
 * @returns {string} - Transformed URL
 */
const generateTransformationUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations
  });
};

/**
 * Get optimized image URLs for different sizes
 * @param {string} publicId - Cloudinary public ID
 * @returns {Object} - Object with different sized URLs
 */
const getOptimizedImageUrls = (publicId) => {
  return {
    thumbnail: generateTransformationUrl(publicId, { width: 150, height: 150, crop: 'fill' }),
    small: generateTransformationUrl(publicId, { width: 300, height: 300, crop: 'fill' }),
    medium: generateTransformationUrl(publicId, { width: 600, height: 600, crop: 'fill' }),
    large: generateTransformationUrl(publicId, { width: 1200, height: 1200, crop: 'fit' }),
    original: generateTransformationUrl(publicId)
  };
};

/**
 * Middleware for handling single file upload
 */
const singleUpload = upload.single('image');

/**
 * Middleware for handling multiple file uploads
 */
const multipleUpload = upload.array('images', 10);

/**
 * Middleware for handling product images (up to 5 images)
 */
const productImagesUpload = upload.array('images', 5);

/**
 * Error handler for multer errors
 */
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Too many files. Maximum is 10 files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
  
  next(error);
};

module.exports = {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  extractPublicId,
  generateTransformationUrl,
  getOptimizedImageUrls,
  singleUpload,
  multipleUpload,
  productImagesUpload,
  handleUploadError
};