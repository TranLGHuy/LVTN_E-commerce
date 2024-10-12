import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Shops from './pages/Shops';
import Cart from './pages/Cart';
import Details from './pages/Details';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/shops' element={<Shops />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/product/details/:slug' element={<Details />} />
    </Routes>
    
    </BrowserRouter>
  )
}

export default App;
