import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { NavBar } from './components/layout';
import { Home } from './components/home';
import { Products } from './components/products';

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
