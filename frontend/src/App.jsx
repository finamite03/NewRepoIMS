import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Layout Components
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main Pages
import Dashboard from './pages/dashboard/Dashboard';
import SKUManagement from './pages/skus/SKUManagement';
import AddEditSKU from './pages/skus/AddEditSKU';
import SKUDetails from './pages/skus/SKUDetails';
import Transactions from './pages/transactions/Transactions';
import StockAdjustments from './pages/inventory/StockAdjustments';
import Suppliers from './pages/suppliers/Suppliers';
import AddEditSupplier from './pages/suppliers/AddEditSupplier';
import Warehouses from './pages/warehouses/Warehouses';
import AddEditWarehouse from './pages/warehouses/AddEditWarehouse';
import SkuVendorMapping from './pages/vendors/SkuVendorMapping';
import Reports from './pages/reports/Reports';

// Context
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          bgcolor: 'background.default' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" state={{ from: location }} />}
      >
        <Route index element={<Dashboard />} />
        <Route path="skus" element={<SKUManagement />} />
        <Route path="skus/add" element={<AddEditSKU />} />
        <Route path="skus/edit/:id" element={<AddEditSKU />} />
        <Route path="skus/:id" element={<SKUDetails />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="stock-adjustments" element={<StockAdjustments />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="suppliers/add" element={<AddEditSupplier />} />
        <Route path="suppliers/edit/:id" element={<AddEditSupplier />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="warehouses/add" element={<AddEditWarehouse />} />
        <Route path="warehouses/edit/:id" element={<AddEditWarehouse />} />
        <Route path="sku-vendor-mapping" element={<SkuVendorMapping />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      
      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;