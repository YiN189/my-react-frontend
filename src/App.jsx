import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TestApi from './components/TestApi';
import ItemManagement from './components/ItemManagement';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <Link to="/test_api" style={{ marginRight: '20px' }}>Test API</Link>
        <Link to="/items">Item Management</Link>
      </nav>
      <Routes>
        <Route path="/test_api" element={<TestApi />} />
        <Route path="/items" element={<ItemManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

