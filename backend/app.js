require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const invoiceRoute = require('./routes/invoiceRoute.js');

// Database pool
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/invoices', invoiceRoute);

// Error fallback
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server after verifying DB connection
async function startServer() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('Postgres connected:', res.rows[0]);

    // Check if invoices table exists; if not, run migration
    const tableCheckRes = await db.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices')"
    );
    if (!tableCheckRes.rows[0].exists) {
      console.log('Invoices table does not exist. Running migration...');
      const migrationSql = fs.readFileSync(path.join(__dirname, 'migrations', 'create_invoices.sql'), 'utf8');
      await db.query(migrationSql);
      console.log('Migration completed successfully');
    }
  } catch (err) {
    console.error('Postgres connection error:', err.message || err);
    // If DB is required for the app to function, exit so the problem is noticed.
    process.exit(1);
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
