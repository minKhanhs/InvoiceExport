const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('../db');

(async () => {
  try {
    const sqlPath = path.join(__dirname, '..', 'migrations', 'create_invoices.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await db.query(sql);
    console.log('Migrations applied successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  }
})();
