import { supabase } from '../config/supabase.js';
import { ok, created, noContent, badRequest, notFound, serverError } from '../middleware/response.js';

/**
 * ItemVars Controller
 * Manages product variants (e.g., Color, Size).
 */

/**
 * GET /api/item-vars
 * Fetch all available product variants.
 */
export async function getItemVars(req, res) {
  try {
    let query = supabase
      .from('item_var')
      .select('id, created_at, color, ssize, tsize, imgsrc')
      .order('id');

    const { data, error } = await query;
    if (error) return serverError(res, error.message);
    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * GET /api/item-vars/:id
 * Fetch a specific variant by ID.
 */
export async function getItemVarById(req, res) {
  try {
    const { data, error } = await supabase
      .from('item_var')
      .select('id, created_at, color, ssize, tsize, imgsrc')
      .eq('id', req.params.id)
      .single();

    if (error && error.code === 'PGRST116') return notFound(res, 'ItemVar');
    if (error) return serverError(res, error.message);
    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * POST /api/item-vars
 * Create a new product variant.
 */
export async function createItemVar(req, res) {
  try {
    const { color, ssize, tsize, imgsrc } = req.body;

    const { data, error } = await supabase
      .from('item_var')
      .insert({ color, ssize, tsize, imgsrc })
      .select('id, created_at, color, ssize, tsize, imgsrc')
      .single();

    if (error) return serverError(res, error.message);
    return created(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * PATCH /api/item-vars/:id
 * Update an existing product variant.
 */
export async function updateItemVar(req, res) {
  try {
    const { color, ssize, tsize, imgsrc } = req.body;

    const updates = {};
    if (color !== undefined) updates.color = color;
    if (ssize !== undefined) updates.ssize = ssize;
    if (tsize !== undefined) updates.tsize = tsize;
    if (imgsrc !== undefined) updates.imgsrc = imgsrc;

    if (Object.keys(updates).length === 0)
      return badRequest(res, 'No fields provided to update');

    const { data, error } = await supabase
      .from('item_var')
      .update(updates)
      .eq('id', req.params.id)
      .select('id, created_at, color, ssize, tsize, imgsrc')
      .single();

    if (error && error.code === 'PGRST116') return notFound(res, 'ItemVar');
    if (error) return serverError(res, error.message);
    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * DELETE /api/item-vars/:id
 * Delete a product variant.
 */
export async function deleteItemVar(req, res) {
  try {
    const { error } = await supabase
      .from('item_var')
      .delete()
      .eq('id', req.params.id);

    if (error) return serverError(res, error.message);
    return noContent(res);
  } catch (err) {
    return serverError(res, err.message);
  }
}
