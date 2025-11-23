const express = require('express');
const router = express.Router();

const invoiceController = require('../controllers/invoiceController');

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.listInvoices);
router.get('/stats', invoiceController.stats);
router.get('/:id', invoiceController.getInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);
router.get('/:id/export', invoiceController.exportInvoice);
router.get('/:id/pdf', invoiceController.exportPdf);

module.exports = router;
