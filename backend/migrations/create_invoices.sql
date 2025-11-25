-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT,
  template_type TEXT,
  customer_name TEXT,
  customer_address TEXT,
  date DATE,
  items JSONB,
  total NUMERIC(14,2),
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for searching by customer name and invoice_number
CREATE INDEX IF NOT EXISTS idx_invoices_customer_name ON invoices USING gin (to_tsvector('simple', coalesce(customer_name, '')));
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices (invoice_number);
