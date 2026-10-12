function parseId(value) {
  if (!/^[1-9]\d*$/.test(String(value))) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function validateVegetable(body, { partial = false } = {}) {
  const errors = [];
  const result = {};

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== 'string' || !body.name.trim() || body.name.trim().length > 100) {
      errors.push('name must be a non-empty string up to 100 characters.');
    } else result.name = body.name.trim();
  }

  if (!partial || body.price !== undefined) {
    const price = body.price;
    if (price === '' || price === undefined || price === null || !Number.isFinite(Number(price)) || Number(price) < 0) {
      errors.push('price must be a number greater than or equal to zero.');
    } else result.price = Number(Number(price).toFixed(2));
  }

  if (!partial || body.stock_quantity !== undefined) {
    const stock = body.stock_quantity;
    if (stock === '' || stock === undefined || stock === null || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      errors.push('stock_quantity must be a non-negative integer.');
    } else result.stock_quantity = Number(stock);
  }

  if (!partial || body.unit !== undefined) {
    const unit = body.unit === undefined ? 'kg' : body.unit;
    if (typeof unit !== 'string' || !unit.trim() || unit.trim().length > 20) {
      errors.push('unit must be a non-empty string up to 20 characters.');
    } else result.unit = unit.trim();
  }

  if (!partial || body.description !== undefined) {
    const description = body.description === undefined ? null : body.description;
    if (description !== null && typeof description !== 'string') {
      errors.push('description must be a string or null.');
    } else result.description = description && description.trim() ? description.trim() : null;
  }

  if (body.image_url !== undefined) {
    if (body.image_url !== null && (typeof body.image_url !== 'string' || body.image_url.length > 500)) {
      errors.push('image_url must be a string up to 500 characters or null.');
    } else result.image_url = body.image_url || null;
  }

  if (body.is_available !== undefined) {
    if (typeof body.is_available !== 'boolean') {
      errors.push('is_available must be true or false.');
    } else result.is_available = body.is_available;
  }

  return { errors, value: result };
}

module.exports = { parseId, validateVegetable };
