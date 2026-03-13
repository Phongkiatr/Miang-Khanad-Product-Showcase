import { supabase } from '../config/supabase.js';
import { ok, created, noContent, notFound, serverError, badRequest } from '../middleware/response.js';

// GET /api/item-vars
// Optional query: ?item_id=x  (filter variants that belong to a specific item)
export async function getItemVars(req, res) {
  try {
    let query = supabase
      .from('item_var')
      .select('id, created_at, color, ssize, tsize')
      .order('id');

    const { data, error } = await query;
    if (error) return serverError(res, error.message);
    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

// GET /api/item-vars/:id
export async function getItemVarById(req, res) {
  try {
    const { data, error } = await supabase
      .from('item_var')
      .select('id, created_at, color, ssize, tsize')
      .eq('id', req.params.id)
      .single();

    if (error && error.code === 'PGRST116') return notFound(res, 'ItemVar');
    if (error) return serverError(res, error.message);
    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

// POST /api/item-vars
// Body: { color, ssize, tsize }
export async function createItemVar(req, res) {
  try {
    const { color, ssize, tsize } = req.body;

    const { data, error } = await supabase
      .from('item_var')
      .insert({ color, ssize, tsize })
      .select('id, created_at, color, ssize, tsize')
      .single();

    if (error) return serverError(res, error.message);
    return created(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

// PATCH /api/item-vars/:id
export async function updateItemVar(req, res) {
  try {
    const { color, ssize, tsize } = req.body;

    const updates = {};
    if (color !== undefined) updates.color = color;
    if (ssize !== undefined) updates.ssize = ssize;
    if (tsize !== undefined) updates.tsize = tsize;

    if (Object.keys(updates).length === 0)
      return badRequest(res, 'No fields provided to update');

    const { data, error } = await supabase
      .from('item_var')
      .update(updates)
      .eq('id', req.params.id)
      .select('id, created_at, color, ssize, tsize')
      .single();

    if (error && error.code === 'PGRST116') return notFound(res, 'ItemVar');
    if (error) return serverError(res, error.message);
    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

// DELETE /api/item-vars/:id
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
