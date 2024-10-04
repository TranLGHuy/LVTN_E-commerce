
import { lazy } from 'react'
const Home = lazy(() => import("../../views/Home"))
const SellerDashboard = lazy(() => import("../../views/seller/SellerDashboard"))
const AddProduct = lazy(() => import("../../views/seller/AddProduct"))
// const AddBanner = lazy(() => import("../../views/seller/AddBanner"))
// const Banners = lazy(() => import("../../views/seller/Banners"))
const Products = lazy(() => import("../../views/seller/Products"))
const Discount = lazy(() => import("../../views/seller/Discount"))
const Orders = lazy(() => import("../../views/seller/Orders"))
const Payments = lazy(() => import("../../views/seller/Payments"))
const SellerToAdmin = lazy(() => import("../../views/seller/SellerToAdmin"))
const SellerToCustomer = lazy(() => import("../../views/seller/SellerToCustomer"))
const Profile = lazy(() => import("../../views/seller/Profile"))
const EditProduct = lazy(() => import("../../views/seller/EditProduct"))
const OrderDetails = lazy(() => import("../../views/seller/OrderDetails.jsx"))
// const Pending = lazy(() => import("../../views/Pending"))
// const Deactive = lazy(() => import("../../views/Deactive"))
export const sellerRoutes = [

    {
        path: '/',
        element: <Home />,
        ability: ['seller','admin']
    },
    {
        path: '/seller/dashboard',
        element: <SellerDashboard />,
        role:'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/add-product',
        element: <AddProduct />,
        role:'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/products',
        element: <Products />,
         role:'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/discount',
        element: <Discount />,
        role:'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/orders',
        element: <Orders />,
        role:'seller',
        ability: ['active','deactive'],
    },
    {
        path: '/seller/dashboard/payments',
        element: <Payments />,
        role:'seller',
        status: 'active'  
    },
    {
        path: '/seller/dashboard/chat-support',
        element: <SellerToAdmin />,
        role:'seller',
        ability: ['active','deactive','pending'],
    },
    {
        path: '/seller/dashboard/chat-customer/:customerId',
        element: <SellerToCustomer />,
        role:'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/chat-customer',
        element: <SellerToCustomer />,
        role:'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/profile',
        element: <Profile />,
        role: 'seller',
        visibility: ['active', 'deactive', 'pending']
    },
    {
        path: '/seller/dashboard/edit-product/:productId',
        element: <EditProduct />,
        role: 'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/order/details/:orderId',
        element: <OrderDetails />,
        role: 'seller',
        visibility: ['active', 'deactive']
    },
    // {
    //     path: '/seller/account_pending',
    //     element: <Pending />,
    //     ability: 'seller'
    // },

    // {
    //     path: '/seller/account_pending',
    //     element: <Pending />,
    //     ability: 'seller'
    // },
    // {
    //     path: '/seller/account_deactive',
    //     element: <Deactive />,
    //     ability: 'seller'
    // },

    

    // {
    //     path: '/seller/dashboard/add_product',
    //     element: <AddProduct />,
    //     role: 'seller',
    //     status: 'active'
    // },
    
    

    
    
    
    
    
    // {
    //     path: '/seller/dashboard/chat_customer',
    //     element: <SellerToCustomer />,
    //     role: 'seller',
    //     status: 'active'
    // },
    
    // {
    //     path: '/seller/dashboard/add_banner/:productId',
    //     element: <AddBanner />,
    //     role: 'seller',
    //     status: 'active'
    // },
    // {
    //     path: '/seller/dashboard/banners',
    //     element: <Banners />,
    //     role: 'seller',
    //     status: 'active'
    // },
]