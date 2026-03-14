import { supabase } from '../config/supabase.js';
import { ok, badRequest, serverError } from '../middleware/response.js';

/**
 * Settings Controller
 * Manages site-wide configuration stored in the 'site_settings' table.
 */

/**
 * GET /api/settings
 * Fetch all settings as a flat key-value object.
 */
export async function getSettings(req, res) {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) {
      // If table doesn't exist yet, return defaults to avoid breaking frontend
      if (error.code === 'PGRST116' || error.message.includes('relation "site_settings" does not exist')) {
        return ok(res, {
          line_id: '@miang-khanad',
          location: 'เชียงใหม่, ประเทศไทย',
          facebook: '',
          instagram: ''
        });
      }
      return serverError(res, error.message);
    }

    // Convert array [{key, value}, ...] to object {key: value, ...}
    const settingsObj = data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    return ok(res, settingsObj);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * PATCH /api/settings
 * Update multiple settings at once (Admin Only).
 * Expects an object where keys are setting keys and values are setting values.
 */
export async function updateSettings(req, res) {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return badRequest(res, 'Invalid updates object');
    }

    const entries = Object.entries(updates);
    
    // Perform updates sequentially or via upsert
    const upsertData = entries.map(([key, value]) => ({
      key,
      value: String(value)
    }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(upsertData, { onConflict: 'key' });

    if (error) return serverError(res, error.message);

    return getSettings(req, res);
  } catch (err) {
    return serverError(res, err.message);
  }
}
