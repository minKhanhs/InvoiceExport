<<<<<<< HEAD
Quick Start with Docker (Recommended for team)
-----------------------------------------------
=======
PostgreSQL setup
-----------------

This backend now includes a PostgreSQL pool in `db.js` and verifies the connection on startup.

Quick start

1. Install new dependency from the `backend` folder:

   npm install

2. Copy `.env.example` to `.env` and set your DB credentials (or set `DATABASE_URL`).

3. Start the app:
>>>>>>> parent of 38a95cb (customize)

Docker automatically sets up PostgreSQL, creates the database, runs migrations, and starts the backend. Perfect for team collaboration — person A (frontend) can just clone and run:

```powershell
# from project root (where docker-compose.yml is)
docker-compose up
```

Server runs at http://localhost:3000. Postgres database is created automatically. No manual setup needed.

To stop:
```powershell
docker-compose down
```

Quick Start without Docker (local dev only)
--------------------------------------------

If you prefer to run locally without Docker:

1. Ensure PostgreSQL is running on localhost:5432 (or update `.env` with your DB config)
2. Install dependencies:
   ```powershell
   cd backend
   npm install
   ```
3. Start the app:
   ```powershell
   node app.js
   ```

The app will check if the `invoices` table exists and auto-run the migration if needed. No manual SQL required.

Notes

- The app will run a `SELECT NOW()` check at startup and exit if the DB connection fails.
- If you need the server to start even without a DB, change the behavior in `app.js`.

Database migration
------------------

Create the invoices table by running the SQL in `migrations/create_invoices.sql` against your database. Example using psql:

```powershell
# from backend folder
psql "postgresql://user:password@host:port/database" -f migrations/create_invoices.sql
```

Or run the file manually in your DB admin tool. After the table exists, the API endpoints below will work.

Automated migration (node)
--------------------------
You can run the provided Node migration script which executes the SQL against the configured database in your `.env`:

```powershell
# from backend folder
node bin/runMigrations.js
```

This reads `migrations/create_invoices.sql` and runs it using the same DB config as the app.

API endpoints (subset)
----------------------
- POST http://localhost:3000/api/invoices  => create invoice (JSON body)
- GET http://localhost:3000/api/invoices   => list invoices (query: search, limit, offset, from, to)
- GET http://localhost:3000/api/invoices/:id => get invoice
- PUT http://localhost:3000/api/invoices/:id => update invoice
- DELETE http://localhost:3000/api/invoices/:id => delete invoice
- GET http://localhost:3000/api/invoices/stats?period=week|month => stats
- GET http://localhost:3000/api/invoices/:id/export => rendered HTML invoice
- GET http://localhost:3000/api/invoices/:id/pdf => generated PDF (attachment)

PDF generation
--------------
The project uses `puppeteer` to render the HTML invoice template to PDF. Install dependencies with `npm install` from the `backend` folder. Puppeteer will download a Chromium binary during install.

If you prefer to avoid Chromium download, consider using `puppeteer-core` with a system Chrome/Chromium and set the `executablePath` in the controller when launching.

