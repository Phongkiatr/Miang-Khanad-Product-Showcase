import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Route imports
import itemsRouter        from './routes/items.routes.js';
import itemTypesRouter    from './routes/itemTypes.routes.js';
import itemVarsRouter     from './routes/itemVars.routes.js';
import inquiryLogsRouter  from './routes/inquiryLogs.routes.js';
import settingsRouter     from './routes/settings.routes.js';
import authRouter         from './routes/auth.routes.js';
import mediaRouter        from './routes/media.routes.js';
// Error and Middleware imports
import { errorHandler, notFoundHandler } from './middleware/response.js';

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());

// CORS: Allow cross-origin requests from specific origins
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser for JSON data
app.use(express.json());

// Request logger
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
app.use('/api/settings',      settingsRouter);
app.use('/api/auth',          authRouter);
app.use('/api/media',         mediaRouter);

// ─── Error handlers (must be last) ───────────────────────────────────────────

app.use(notFoundHandler); // 404 Route not found
app.use(errorHandler);    // Global error handler

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  MeangKanad API running on http://localhost:${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
