
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Shops from './pages/Shops';
import Cart from './pages/Cart';
import Details from './pages/Details';
import Register from './pages/Register';
import Login from './pages/Login';
import Shipping from './pages/Shipping';
import { get_category } from './store/reducers/homeReducer'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import CategoryShop from './pages/CategoryShop';
import SearchProducts from './pages/SearchProducts';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import Dashboard from './pages/Dashboard';
import ProtectUser from './utils/ProtectUser';
import Index from './components/dashboard/Index';
import Orders from './components/dashboard/Orders';
import Wishlist from './components/dashboard/Wishlist';
import ChangePassword from './components/dashboard/ChangePassword';
import Chat from './components/dashboard/Chat';
import Order from './components/dashboard/Order';
function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(get_category())
  }, [])
  return (
    
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Home/>} />
      <Route path='/shops' element={<Shops />} />
      <Route path='/products?' element={<CategoryShop />} />
      <Route path='/products/search?' element={<SearchProducts />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/shipping' element={<Shipping />} />
      <Route path='/payment' element={<Payment />} />
      <Route path="/order-success" element={<OrderSuccess />} /> 
      <Route path='/product/details/:slug' element={<Details />} />
      <Route path='/dashboard' element={<ProtectUser />} > 
        <Route path='' element={<Dashboard />}> 
            <Route path='' element={<Index />} />
            <Route path='my-orders' element={<Orders />} />
            <Route path='my-wishlist' element={<Wishlist />} />
            <Route path='change-password' element={<ChangePassword />} />
            <Route path='chat' element={<Chat />} />
            <Route path='order/details/:orderId' element={<Order />} />
        </Route>
      </Route>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App;
