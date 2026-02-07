import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TestApi from './components/TestApi';
import ItemManagement from './components/ItemManagement';
import UserManagement from './components/UserManagement';

function App() {
  return (
    <BrowserRouter>
      <nav style={{
        padding: '15px 30px',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        gap: '30px'
      }}>
        <Link to="/test_api" style={{
          color: '#fff',
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: '1rem',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'background 0.2s'
        }}>🔗 Test API</Link>
        <Link to="/items" style={{
          color: '#fff',
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: '1rem',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'background 0.2s'
        }}>📦 Item Management</Link>
        <Link to="/users" style={{
          color: '#fff',
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: '1rem',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'background 0.2s'
        }}>👥 User Management</Link>
      </nav>
      <Routes>
        <Route path="/test_api" element={<TestApi />} />
        <Route path="/items" element={<ItemManagement />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

