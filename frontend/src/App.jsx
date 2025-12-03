import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { InvoiceList } from './pages/dashboard/InvoiceList';
import { CreateInvoice } from './pages/dashboard/CreateInvoice';
import { DashboardLayout } from './layouts/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/invoices" element={<InvoiceList />} />
          <Route path="/dashboard/invoices/new" element={<CreateInvoice />} />
          <Route path="/dashboard/invoices/:id/edit" element={<CreateInvoice />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
