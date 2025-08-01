const express = require('express');
const {
  singleUpload,
  multipleUpload,
  productImagesUpload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
  handleUploadError
} = require('../utils/upload');
const { authenticateAdmin } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/errorHandler');

const router = express.Router();

/**
 * Upload single image
 * @route POST /api/upload/single
 * @access Private (Admin)
 */
router.post('/single', authenticateAdmin, singleUpload, handleUploadError, asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded'
    });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, 'green-panda/general');
    
    res.json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image'
    });
  }
}));

/**
 * Upload multiple images
 * @route POST /api/upload/multiple
 * @access Private (Admin)
 */
router.post('/multiple', authenticateAdmin, multipleUpload, handleUploadError, asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No files uploaded'
    });
  }

  try {
    const uploadResults = await uploadMultipleToCloudinary(req.files, 'green-panda/gallery');
    
    const images = uploadResults.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }));

    res.json({
      status: 'success',
      message: `${images.length} images uploaded successfully`,
      data: {
        images,
        count: images.length
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload images'
    });
  }
}));

/**
 * Upload product images
 * @route POST /api/upload/product
 * @access Private (Admin)
 */
router.post('/product', authenticateAdmin, productImagesUpload, handleUploadError, asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No files uploaded'
    });
  }

  try {
    const uploadResults = await uploadMultipleToCloudinary(req.files, 'green-panda/products');
    
    const images = uploadResults.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }));

    res.json({
      status: 'success',
      message: `${images.length} product images uploaded successfully`,
      data: {
        images,
        count: images.length
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload product images'
    });
  }
}));

/**
 * Delete image
 * @route DELETE /api/upload/:publicId
 * @access Private (Admin)
 */
router.delete('/:publicId(*)', authenticateAdmin, asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  if (!publicId) {
    return res.status(400).json({
      status: 'error',
      message: 'Public ID is required'
    });
  }

  try {
    const result = await deleteFromCloudinary(publicId);
    
    if (result.result === 'ok') {
      res.json({
        status: 'success',
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Image not found'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image'
    });
  }
}));

/**
 * Delete multiple images
 * @route DELETE /api/upload/batch
 * @access Private (Admin)
 */
router.delete('/batch', authenticateAdmin, asyncHandler(async (req, res) => {
  const { publicIds } = req.body;

  if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Array of public IDs is required'
    });
  }

  try {
    const result = await deleteMultipleFromCloudinary(publicIds);
    
    res.json({
      status: 'success',
      message: 'Images deleted successfully',
      data: {
        deleted: result.deleted,
        deletedCount: Object.keys(result.deleted).length,
        partial: result.partial || false
      }
    });
  } catch (error) {
    console.error('Batch delete error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete images'
    });
  }
}));

module.exports = router;