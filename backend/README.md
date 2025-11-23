Start the app:

   node app.js

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


