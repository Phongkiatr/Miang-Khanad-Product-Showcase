import { supabase } from '../config/supabase.js';
import { ok, created, noContent, badRequest, serverError } from '../middleware/response.js';

const BUCKET_NAME = 'gallery';

/**
 * Media Controller
 * Manages image uploads, listing, and deletions using Supabase Storage.
 */

/**
 * GET /api/media
 * List all images in the gallery bucket.
 */
export async function listImages(req, res) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) return serverError(res, error.message);

    // Form full URLs for each file
    const filesWithUrls = data.map((file) => {
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(file.name);
      
      return {
        ...file,
        url: publicUrl,
      };
    });

    return ok(res, filesWithUrls);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * POST /api/media/upload
 * Upload an image to the gallery bucket.
 * Uses multer middleware for file handling.
 */
export async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return badRequest(res, 'No file uploaded');
    }

    const file = req.file;
    const customName = req.body.customName;
    const timestamp = Date.now();
    
    // Backend Validation for customName
    if (customName && !/^[a-zA-Z0-9\-_]+$/.test(customName)) {
      return badRequest(res, 'Custom name must only contain English characters, numbers, underscores, or hyphens (no spaces).');
    }

    // Helper to sanitize filename: keep alphanumeric, underscores, hyphens, and dots.
    const sanitize = (str) => str.replace(/[^a-zA-Z0-9.\-_]/g, '_');

    let fileName;
    if (customName) {
      const ext = file.originalname.split('.').pop();
      const sanitizedCustom = sanitize(customName);
      fileName = `${sanitizedCustom || 'image'}_${timestamp}.${ext}`;
    } else {
      const sanitizedOriginal = sanitize(file.originalname);
      fileName = `${timestamp}-${sanitizedOriginal}`;
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) return serverError(res, error.message);

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return created(res, {
      name: fileName,
      path: data.path,
      url: publicUrl
    });
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * DELETE /api/media/:name
 * Delete an image from the gallery bucket.
 */
export async function deleteImage(req, res) {
  try {
    const { name } = req.params;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([name]);

    if (error) return serverError(res, error.message);

    return noContent(res);
  } catch (err) {
    return serverError(res, err.message);
  }
}
