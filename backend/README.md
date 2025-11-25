Quick Start with Docker (Recommended for team)
-----------------------------------------------

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


