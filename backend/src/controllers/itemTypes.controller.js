import { supabase } from '../config/supabase.js';
import { ok, created, noContent, badRequest, notFound, serverError } from '../middleware/response.js';

/**
 * ItemTypes Controller
 * Manages product categories (e.g., Clothing, Instruments).
 */

/**
 * GET /api/item-types
 * Fetch all available product categories.
 */
export async function getItemTypes(req, res) {
  try {
    const { data, error } = await supabase
      .from('item_type')
      .select('id, created_at, name')
      .order('id');

    if (error) return serverError(res, error.message);
    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * GET /api/item-types/:id
 * Fetch a specific category by ID.
 */
export async function getItemTypeById(req, res) {
  try {
    const { data, error } = await supabase
      .from('item_type')
      .select('id, created_at, name')
      .eq('id', req.params.id)
      .single();

    if (error && error.code === 'PGRST116') return notFound(res, 'ItemType');
    if (error) return serverError(res, error.message);
    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * POST /api/item-types
 * Create a new product category.
 */
export async function createItemType(req, res) {
  try {
    const { name } = req.body;

    const { data, error } = await supabase
      .from('item_type')
      .insert({ name })
      .select('id, created_at, name')
      .single();

    if (error) return serverError(res, error.message);
    return created(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * PATCH /api/item-types/:id
 * Update an existing category name.
 */
export async function updateItemType(req, res) {
  try {
    const { name } = req.body;
    if (!name) return badRequest(res, 'name is required');

    const { data, error } = await supabase
      .from('item_type')
      .update({ name })
      .eq('id', req.params.id)
      .select('id, created_at, name')
      .single();

    if (error && error.code === 'PGRST116') return notFound(res, 'ItemType');
    if (error) return serverError(res, error.message);
    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * DELETE /api/item-types/:id
 * Delete a product category.
 */
export async function deleteItemType(req, res) {
  try {
    const { error } = await supabase
      .from('item_type')
      .delete()
      .eq('id', req.params.id);

    if (error) return serverError(res, error.message);
    return noContent(res);
  } catch (err) {
    return serverError(res, err.message);
  }
}
