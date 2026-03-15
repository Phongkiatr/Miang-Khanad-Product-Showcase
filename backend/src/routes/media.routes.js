import express from 'express';
import multer from 'multer';
import * as mediaController from '../controllers/media.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Multer setup for memory storage (for Supabase upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

/**
 * Media Routes
 * All routes are protected by admin authentication.
 */

router.get('/', auth, mediaController.listImages);
router.post('/upload', auth, upload.single('image'), mediaController.uploadImage);
router.delete('/:name', auth, mediaController.deleteImage);

export default router;
