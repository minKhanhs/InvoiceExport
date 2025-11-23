const invoiceService = require('../services/invoiceService');
const fs = require('fs');
const path = require('path');

exports.createInvoice = async (req, res, next) => {
  try {
    const created = await invoiceService.createInvoice(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoice(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Not found' });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const updated = await invoiceService.updateInvoice(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    const deleted = await invoiceService.deleteInvoice(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};

exports.listInvoices = async (req, res, next) => {
  try {
    const q = {
      search: req.query.search,
      limit: parseInt(req.query.limit, 10) || 50,
      offset: parseInt(req.query.offset, 10) || 0,
      from: req.query.from,
      to: req.query.to,
    };
    const rows = await invoiceService.listInvoices(q);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.stats = async (req, res, next) => {
  try {
    const period = req.query.period || 'month';
    const data = await invoiceService.stats(period);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Export invoice as rendered HTML (simple template fill)
exports.exportInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoice(req.params.id);
    if (!invoice) return res.status(404).send('Invoice not found');

    const tplPath = path.join(__dirname, '..', 'templates', 'invoice.html');
    let tpl = fs.readFileSync(tplPath, 'utf8');

    // Simple replacements. Template should use {{field}} placeholders.
    tpl = tpl.replace(/{{customer_name}}/g, invoice.customer_name || '')
             .replace(/{{customer_address}}/g, invoice.customer_address || '')
             .replace(/{{invoice_number}}/g, invoice.invoice_number || '')
             .replace(/{{date}}/g, invoice.date ? new Date(invoice.date).toLocaleDateString() : '')
             .replace(/{{total}}/g, invoice.total || 0);

    // Fill items table
    const items = invoice.items || [];
    let itemsHtml = '';
    for (let i = 0; i < Math.max(items.length, 10); i++) {
      const it = items[i] || { name: '', qty: '', price: '', amount: '' };
      itemsHtml += `<tr><td>${i+1}</td><td>${it.name || ''}</td><td>${it.qty || ''}</td><td>${it.price || ''}</td><td>${it.amount || ''}</td></tr>`;
    }
    tpl = tpl.replace(/{{items_rows}}/g, itemsHtml);

    res.setHeader('Content-Type', 'text/html');
    res.send(tpl);
  } catch (err) {
    next(err);
  }
};

  // Export invoice as PDF (generates PDF from the HTML template)
  exports.exportPdf = async (req, res, next) => {
    try {
      const invoice = await invoiceService.getInvoice(req.params.id);
      if (!invoice) return res.status(404).send('Invoice not found');

      const tplPath = path.join(__dirname, '..', 'templates', 'invoice.html');
      let tpl = fs.readFileSync(tplPath, 'utf8');

      tpl = tpl.replace(/{{customer_name}}/g, invoice.customer_name || '')
               .replace(/{{customer_address}}/g, invoice.customer_address || '')
               .replace(/{{invoice_number}}/g, invoice.invoice_number || '')
               .replace(/{{date}}/g, invoice.date ? new Date(invoice.date).toLocaleDateString() : '')
               .replace(/{{total}}/g, invoice.total || 0);

      const items = invoice.items || [];
      let itemsHtml = '';
      for (let i = 0; i < Math.max(items.length, 10); i++) {
        const it = items[i] || { name: '', qty: '', price: '', amount: '' };
        itemsHtml += `<tr><td>${i+1}</td><td>${it.name || ''}</td><td>${it.qty || ''}</td><td>${it.price || ''}</td><td>${it.amount || ''}</td></tr>`;
      }
      tpl = tpl.replace(/{{items_rows}}/g, itemsHtml);

      // Require puppeteer at runtime so the module can be loaded even if puppeteer isn't installed yet.
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(tpl, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.id}.pdf"`);
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  };
