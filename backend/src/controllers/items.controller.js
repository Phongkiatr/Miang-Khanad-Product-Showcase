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
         item_var ( id, color, ssize, tsize )`,
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
         item_var ( id, color, ssize, tsize )`
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
 * Now supports passing an array of variants.
 */
export async function createItem(req, res) {
  try {
    const { name, description, price, item_type, imgsrc, variants } = req.body;

    // 1. Create the item
    const { data: item, error: itemError } = await supabase
      .from('Items')
      .insert({ name, description, price, item_type, imgsrc })
      .select()
      .single();

    if (itemError) return serverError(res, itemError.message);

    // 2. If variants provided, insert them linked to the new item
    if (Array.isArray(variants) && variants.length > 0) {
      const varsToInsert = variants.map(v => ({
        ...v,
        item_id: item.id
      }));
      const { error: varError } = await supabase
        .from('item_var')
        .insert(varsToInsert);
      
      if (varError) console.error('Error inserting variants:', varError.message);
    }

    // 3. Re-fetch full item with variants for response
    return getItemById({ params: { id: item.id } }, res);
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
    const { name, description, price, item_type, imgsrc, variants } = req.body;

    // Filter provided fields for update
    const updates = {};
    if (name        !== undefined) updates.name        = name;
    if (description !== undefined) updates.description = description;
    if (price       !== undefined) updates.price       = price;
    if (item_type   !== undefined) updates.item_type   = item_type;
    if (imgsrc      !== undefined) updates.imgsrc      = imgsrc;

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('Items')
        .update(updates)
        .eq('id', id);
      
      if (updateError) return serverError(res, updateError.message);
    }

    // Handle Variants Syncing (Simple approach: delete old and insert new)
    if (variants !== undefined && Array.isArray(variants)) {
      // 1. Delete existing variants for this item
      await supabase.from('item_var').delete().eq('item_id', id);

      // 2. Insert new variants
      if (variants.length > 0) {
        const varsToInsert = variants.map(v => ({
          color: v.color,
          ssize: v.ssize,
          tsize: v.tsize,
          item_id: id
        }));
        await supabase.from('item_var').insert(varsToInsert);
      }
    }

    return getItemById({ params: { id } }, res);
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
