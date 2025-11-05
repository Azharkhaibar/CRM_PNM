
import './App.css';
import { Mainpage } from './pages/mainpage/home';
import { Routes, Route } from 'react-router-dom';
function App() {

  return (
    <Routes>
      <Route path="/" element={<Mainpage />} />
    </Routes>
  );
}

export default App;
