const db = require('../db');

async function createInvoice(data) {
  const { invoice_number, template_type, customer_name, customer_address, date, items, total, meta } = data;
  const res = await db.query(
    `INSERT INTO invoices (invoice_number, template_type, customer_name, customer_address, date, items, total, meta)
     VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8::jsonb) RETURNING *`,
    [invoice_number, template_type, customer_name, customer_address, date, JSON.stringify(items || []), total || 0, JSON.stringify(meta || {})]
  );
  return res.rows[0];
}

async function getInvoiceById(id) {
  const res = await db.query('SELECT * FROM invoices WHERE id=$1', [id]);
  return res.rows[0];
}

async function updateInvoice(id, data) {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key of ['invoice_number','template_type','customer_name','customer_address','date','items','total','meta']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx}` + (key === 'items' || key === 'meta' ? '::jsonb' : ''));
      values.push(key === 'items' || key === 'meta' ? JSON.stringify(data[key]) : data[key]);
      idx++;
    }
  }
  if (fields.length === 0) return getInvoiceById(id);
  values.push(id);
  const sql = `UPDATE invoices SET ${fields.join(', ')}, updated_at = now() WHERE id = $${idx} RETURNING *`;
  const res = await db.query(sql, values);
  return res.rows[0];
}

async function deleteInvoice(id) {
  const res = await db.query('DELETE FROM invoices WHERE id=$1 RETURNING *', [id]);
  return res.rows[0];
}

async function listInvoices({ search, limit = 50, offset = 0, from, to }) {
  const where = [];
  const values = [];
  let idx = 1;
  if (search) {
    where.push(`(invoice_number ILIKE $${idx} OR customer_name ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }
  if (from) {
    where.push(`date >= $${idx}`);
    values.push(from);
    idx++;
  }
  if (to) {
    where.push(`date <= $${idx}`);
    values.push(to);
    idx++;
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `SELECT * FROM invoices ${whereSql} ORDER BY date DESC LIMIT $${idx} OFFSET $${idx+1}`;
  values.push(limit, offset);
  const res = await db.query(sql, values);
  return res.rows;
}

async function stats(period = 'month') {
  // period: 'week' or 'month'
  if (period === 'week') {
    const res = await db.query(
      `SELECT date_trunc('day', date) AS day, count(*) AS count, sum(total) AS total
       FROM invoices
       WHERE date >= (now()::date - INTERVAL '6 days')
       GROUP BY day
       ORDER BY day`
    );
    return res.rows;
  }
  // default month
  const res = await db.query(
    `SELECT date_trunc('day', date) AS day, count(*) AS count, sum(total) AS total
     FROM invoices
     WHERE date >= (now()::date - INTERVAL '29 days')
     GROUP BY day
     ORDER BY day`
  );
  return res.rows;
}

module.exports = {
  createInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  listInvoices,
  stats,
};
