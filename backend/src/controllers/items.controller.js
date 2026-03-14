import { supabase } from '../config/supabase.js';
import { ok, created, noContent, badRequest, notFound, serverError } from '../middleware/response.js';

/**
 * Items Controller
 * Manages core product data, including fetching with category and variant details.
 */

/**
 * GET /api/items
 * Fetch products with optional filtering by category, search term, and pagination.
 */
export async function getItems(req, res) {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const from = (Number(page) - 1) * Number(limit);
    const to   = from + Number(limit) - 1;

    let query = supabase
      .from('Items')
      .select(
        `id, created_at, name, description, price, imgsrc,
         item_type ( id, name ),
         item_var  ( id, color, ssize, tsize )`,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (category) query = query.eq('item_type', Number(category));
    if (search)   query = query.ilike('name', `%${search}%`);

    const { data, error, count } = await query;

    if (error) return serverError(res, error.message);

    return ok(res, data, {
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * GET /api/items/:id
 * Fetch detailed information for a single product by ID.
 */
export async function getItemById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('Items')
      .select(
        `id, created_at, name, description, price, imgsrc,
         item_type ( id, name ),
         item_var  ( id, color, ssize, tsize )`
      )
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return notFound(res, 'Item');
    if (error) return serverError(res, error.message);

    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * POST /api/items
 * Create a new product entry (Admin Only).
 */
export async function createItem(req, res) {
  try {
    const { name, description, price, item_type, imgsrc, item_var } = req.body;

    const { data, error } = await supabase
      .from('Items')
      .insert({ name, description, price, item_type, imgsrc, item_var })
      .select(
        `id, created_at, name, description, price, imgsrc,
         item_type ( id, name ),
         item_var  ( id, color, ssize, tsize )`
      )
      .single();

    if (error) return serverError(res, error.message);

    return created(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * PATCH /api/items/:id
 * Update an existing product's information (Admin Only).
 */
export async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, item_type, imgsrc, item_var } = req.body;

    // Filter provided fields for update
    const updates = {};
    if (name        !== undefined) updates.name        = name;
    if (description !== undefined) updates.description = description;
    if (price       !== undefined) updates.price       = price;
    if (item_type   !== undefined) updates.item_type   = item_type;
    if (imgsrc      !== undefined) updates.imgsrc      = imgsrc;
    if (item_var    !== undefined) updates.item_var    = item_var;

    if (Object.keys(updates).length === 0)
      return badRequest(res, 'No fields provided to update');

    const { data, error } = await supabase
      .from('Items')
      .update(updates)
      .eq('id', id)
      .select(
        `id, created_at, name, description, price, imgsrc,
         item_type ( id, name ),
         item_var  ( id, color, ssize, tsize )`
      )
      .single();

    if (error && error.code === 'PGRST116') return notFound(res, 'Item');
    if (error) return serverError(res, error.message);

    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * DELETE /api/items/:id
 * Permanently remove a product from the database (Admin Only).
 */
export async function deleteItem(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('Items')
      .delete()
      .eq('id', id);

    if (error && error.code === 'PGRST116') return notFound(res, 'Item');
    if (error) return serverError(res, error.message);

    return noContent(res);
  } catch (err) {
    return serverError(res, err.message);
  }
}
