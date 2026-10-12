const express = require('express');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const upload = require('../middleware/upload');
const { parseId, validateVegetable } = require('../utils/validation');

const router = express.Router();

function removeLocalUpload(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;
  const filename = path.basename(imageUrl);
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  fs.unlink(filePath, () => {});
}

// GET /api/vegetables?search=tomato&page=1&limit=20
router.get('/', async (req, res, next) => {
  try {
    const search = String(req.query.search || '').trim().slice(0, 100);
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT id, name, description, price, stock_quantity, unit, image_url,
              is_available, created_at, updated_at
       FROM vegetables
       WHERE name ILIKE $1
       ORDER BY id DESC
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    const count = await pool.query(
      'SELECT COUNT(*)::INTEGER AS total FROM vegetables WHERE name ILIKE $1',
      [`%${search}%`]
    );

    res.json({
      data: result.rows,
      pagination: { page, limit, total: count.rows[0].total }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/vegetables/:id
router.get('/:id', async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: 'Invalid vegetable ID.' });

  try {
    const result = await pool.query('SELECT * FROM vegetables WHERE id = $1', [id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Vegetable not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/vegetables (multipart/form-data with optional image field named "image")
router.post('/', upload.single('image'), async (req, res, next) => {
  const { errors, value } = validateVegetable(req.body);
  if (errors.length) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : (value.image_url || null);

  try {
    const result = await pool.query(
      `INSERT INTO vegetables
       (name, description, price, stock_quantity, unit, image_url, is_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        value.name, value.description, value.price, value.stock_quantity,
        value.unit, imageUrl, value.is_available === undefined ? true : value.is_available
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(error);
  }
});

// PUT /api/vegetables/:id (multipart/form-data with optional image field named "image")
router.put('/:id', upload.single('image'), async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ message: 'Invalid vegetable ID.' });
  }

  const { errors, value } = validateVegetable(req.body);
  if (errors.length) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : (value.image_url || null);

  try {
    const result = await pool.query(
      `UPDATE vegetables
       SET name = $1, description = $2, price = $3, stock_quantity = $4,
           unit = $5, image_url = $6, is_available = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        value.name, value.description, value.price, value.stock_quantity,
        value.unit, imageUrl, value.is_available === undefined ? true : value.is_available, id
      ]
    );

    if (!result.rowCount) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: 'Vegetable not found.' });
    }

    const oldImage = result.rows[0].image_url;
    // A newly uploaded image replaces the previous one.
    if (req.file && oldImage && oldImage !== imageUrl) removeLocalUpload(oldImage);
    res.json(result.rows[0]);
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(error);
  }
});

// DELETE /api/vegetables/:id
router.delete('/:id', async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: 'Invalid vegetable ID.' });

  try {
    const result = await pool.query(
      'DELETE FROM vegetables WHERE id = $1 RETURNING id, image_url',
      [id]
    );
    if (!result.rowCount) return res.status(404).json({ message: 'Vegetable not found.' });
    removeLocalUpload(result.rows[0].image_url);
    res.json({ message: 'Vegetable deleted successfully.', id: result.rows[0].id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
