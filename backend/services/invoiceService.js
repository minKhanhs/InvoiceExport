const invoiceModel = require('../models/invoiceModel');

async function createInvoice(payload) {
  // Basic validation could go here
  if (!payload.date) payload.date = new Date();
  const created = await invoiceModel.createInvoice(payload);
  return created;
}

async function getInvoice(id) {
  return invoiceModel.getInvoiceById(id);
}

async function updateInvoice(id, payload) {
  return invoiceModel.updateInvoice(id, payload);
}

async function deleteInvoice(id) {
  return invoiceModel.deleteInvoice(id);
}

async function listInvoices(query) {
  return invoiceModel.listInvoices(query);
}

async function stats(period) {
  return invoiceModel.stats(period);
}

module.exports = {
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  listInvoices,
  stats,
};
