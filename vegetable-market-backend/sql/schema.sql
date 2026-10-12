-- Run this while connected to the vegetable_market database.
CREATE TABLE IF NOT EXISTS vegetables (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    image_url VARCHAR(500),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vegetables_name ON vegetables (name);
CREATE INDEX IF NOT EXISTS idx_vegetables_available ON vegetables (is_available);

-- Optional sample data. Run once only if you want demo products.
INSERT INTO vegetables (name, description, price, stock_quantity, unit)
SELECT v.name, v.description, v.price, v.stock_quantity, v.unit
FROM (VALUES
    ('Tomato', 'Fresh red tomatoes', 30.00::NUMERIC, 100, 'kg'),
    ('Potato', 'Fresh potatoes', 25.00::NUMERIC, 150, 'kg'),
    ('Onion', 'Fresh onions', 35.00::NUMERIC, 120, 'kg'),
    ('Carrot', 'Fresh carrots', 45.00::NUMERIC, 60, 'kg'),
    ('Cabbage', 'Fresh green cabbage', 30.00::NUMERIC, 40, 'piece')
) AS v(name, description, price, stock_quantity, unit)
WHERE NOT EXISTS (SELECT 1 FROM vegetables);
