require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');
const vegetableRoutes = require('./routes/vegetableRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200,http://localhost:8100')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    // Allow tools such as Postman with no Origin header during local development.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS.'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', message: 'Backend and database connected.' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/vegetables', vegetableRoutes);
app.use('/api/checkout', checkoutRoutes);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () => {
  console.log(`Vegetable Market API running at http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
