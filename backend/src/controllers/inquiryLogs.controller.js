import { supabase } from '../config/supabase.js';
import { ok, created, noContent, notFound, serverError } from '../middleware/response.js';

/**
 * GET /api/inquiry-logs
 * Fetch all inquiry logs with pagination.
 * Supports filtering by item_id.
 */
export async function getInquiryLogs(req, res) {
  try {
    const { page = 1, limit = 50, item_id } = req.query;

    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    let query = supabase
      .from('inquiry_logs')
      .select(
        `id, created_at,
         Items ( id, name )`,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (item_id) query = query.eq('Items', Number(item_id));

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
 * GET /api/inquiry-logs/:id
 * Fetch a single inquiry log by ID.
 */
export async function getInquiryLogById(req, res) {
  try {
    const { data, error } = await supabase
      .from('inquiry_logs')
      .select(
        'id, created_at, Items (id, name)'
      )
      .eq('id', req.params.id)
      .single();

    if (error && error.code === 'PGRST116') return notFound(res, 'InquiryLog');
    if (error) return serverError(res, error.message);
    return ok(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * POST /api/inquiry-logs
 * Create a new log entry when a customer clicks "Contact via LINE".
 */
export async function createInquiryLog(req, res) {
  try {
    const { items: itemId } = req.body; // item/product ID

    const { data, error } = await supabase
      .from('inquiry_logs')
      .insert({ items: itemId })
      .select(
        `id, created_at,
         Items ( id, name )`
      )
      .single();

    if (error) return serverError(res, error.message);
    return created(res, data);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * DELETE /api/inquiry-logs/:id
 * Delete an inquiry log (Admin Only).
 */
export async function deleteInquiryLog(req, res) {
  try {
    const { error } = await supabase
      .from('inquiry_logs')
      .delete()
      .eq('id', req.params.id);

    if (error) return serverError(res, error.message);
    return noContent(res);
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * GET /api/inquiry-logs/stats
 * Get inquiry statistics: total count and top 5 inquired items.
 */
export async function getInquiryStats(req, res) {
  try {
    // 1. Get total record count
    const { count: total, error: countErr } = await supabase
      .from('inquiry_logs')
      .select('*', { count: 'exact', head: true });

    if (countErr) return serverError(res, countErr.message);

    // 2. Fetch all logs to compute top items (Supabase JS client lacks GROUP BY)
    const { data: logs, error: logsErr } = await supabase
      .from('inquiry_logs')
      .select('Items ( id, name )');

    if (logsErr) return serverError(res, logsErr.message);

    // Tally item counts manually
    const tally = {};
    for (const log of logs) {
      const item = log.Items;
      if (!item) continue;
      const key = item.id;
      if (!tally[key]) tally[key] = { ...item, inquiry_count: 0 };
      tally[key].inquiry_count++;
    }

    // Sort to get top 5
    const topItems = Object.values(tally)
      .sort((a, b) => b.inquiry_count - a.inquiry_count)
      .slice(0, 5);

    return ok(res, { total, topItems });
  } catch (err) {
    return serverError(res, err.message);
  }
}
