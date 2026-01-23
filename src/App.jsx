import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestApi from './components/TestApi';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test_api" element={<TestApi />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;