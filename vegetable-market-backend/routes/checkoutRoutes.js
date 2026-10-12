const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Demo checkout only: validates stock and calculates totals but deliberately
// does not persist customer details or an order record.
router.post('/cod', async (req, res, next) => {
  const { customer_name, phone, address, items } = req.body || {};

  if (
    typeof customer_name !== 'string' || !customer_name.trim() ||
    typeof phone !== 'string' || !/^[0-9+\-\s()]{7,20}$/.test(phone.trim()) ||
    typeof address !== 'string' || !address.trim() ||
    !Array.isArray(items) || items.length === 0 || items.length > 50
  ) {
    return res.status(400).json({
      message: 'Provide customer_name, valid phone, address, and a non-empty items array.'
    });
  }

  const quantities = new Map();
  for (const item of items) {
    const id = Number(item && item.id);
    const quantity = Number(item && item.quantity);
    if (!Number.isSafeInteger(id) || id <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Each item needs a valid id and positive integer quantity.' });
    }
    quantities.set(id, (quantities.get(id) || 0) + quantity);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const ids = [...quantities.keys()];
    const result = await client.query(
      `SELECT id, name, price, stock_quantity, unit, is_available
       FROM vegetables WHERE id = ANY($1::bigint[]) ORDER BY id FOR UPDATE`,
      [ids]
    );

    if (result.rowCount !== ids.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'One or more vegetables no longer exist.' });
    }

    const lines = [];
    let total = 0;

    for (const vegetable of result.rows) {
      const quantity = quantities.get(Number(vegetable.id));
      if (!vegetable.is_available || vegetable.stock_quantity < quantity) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          message: `Insufficient stock for ${vegetable.name}.`,
          available_stock: vegetable.stock_quantity
        });
      }

      const unitPrice = Number(vegetable.price);
      const lineTotal = Number((unitPrice * quantity).toFixed(2));
      total = Number((total + lineTotal).toFixed(2));
      lines.push({
        id: Number(vegetable.id),
        name: vegetable.name,
        quantity,
        unit: vegetable.unit,
        unit_price: unitPrice,
        line_total: lineTotal
      });
    }

    // This demo decrements inventory but does not save order/customer details.
    for (const line of lines) {
      await client.query(
        `UPDATE vegetables
         SET stock_quantity = stock_quantity - $1,
             is_available = CASE WHEN stock_quantity - $1 = 0 THEN FALSE ELSE is_available END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [line.quantity, line.id]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: 'COD checkout validated. Order details were not stored.',
      payment_method: 'CASH_ON_DELIVERY',
      customer_name: customer_name.trim(),
      total,
      items: lines
    });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    next(error);
  } finally {
    client.release();
  }
});

module.exports = router;
