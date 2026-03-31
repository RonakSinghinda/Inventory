import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import productsRoutes from './modules/products/products.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import vendorsRoutes from './modules/vendors/vendors.routes';
import usersRoutes from './modules/users/users.routes';
import stockRoutes from './modules/stock/stock.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

const app = express();

// ── Global Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/vendors', vendorsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── Global Error Handler (must be last) ──
app.use(errorHandler);

export default app;
