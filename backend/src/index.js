import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import itemsRouter        from './routes/items.routes.js';
import itemTypesRouter    from './routes/itemTypes.routes.js';
import itemVarsRouter     from './routes/itemVars.routes.js';
import inquiryLogsRouter  from './routes/inquiryLogs.routes.js';
import { errorHandler, notFoundHandler } from './middleware/response.js';

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/items',         itemsRouter);
app.use('/api/item-types',    itemTypesRouter);
app.use('/api/item-vars',     itemVarsRouter);
app.use('/api/inquiry-logs',  inquiryLogsRouter);

// ─── Error handlers (must be last) ───────────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  เมียงขนาด API running on http://localhost:${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || 'development'}`);
});
