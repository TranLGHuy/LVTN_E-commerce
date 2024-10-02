import { MdOutlineDashboard,MdOutlineShoppingBag,MdOutlineLogout } from "react-icons/md";
import { TfiDashboard } from "react-icons/tfi";
import { GrUserManager } from "react-icons/gr";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { LuUserX } from "react-icons/lu";
import { BiLoaderCircle } from "react-icons/bi";
import { BsFillChatLeftTextFill } from "react-icons/bs";
export const allNav = [
    {
        id: 1,
        title : 'Dashboard',
        icon: <TfiDashboard />,
        role: 'admin',
        path: '/admin/dashboard'
    },
    
    {
        id: 2,
        title : 'Orders',
        icon: <MdOutlineShoppingBag/>,
        role: 'admin',
        path: '/admin/dashboard/orders'
    },
    {
        id: 3,
        title : 'Category',
        icon: <MdOutlineDashboard/>,
        role: 'admin',
        path: '/admin/dashboard/category'
    },
    {
        id: 4,
        title : 'Sellers',
        icon: <GrUserManager/>,
        role: 'admin',
        path: '/admin/dashboard/sellers'
    },
    {
        id: 5,
        title : 'Payment request',
        icon: <FaMoneyBillTransfer/>,
        role: 'admin',
        path: '/admin/dashboard/payment_request'
    },
    {
        id: 6,
        title : 'Deactive Seller',
        icon: <LuUserX/>,
        role: 'admin',
        path: '/admin/dashboard/deactive_sellers'
    },
    {
        id: 7,
        title : 'Seller Request',
        icon: <BiLoaderCircle />,
        role: 'admin',
        path: '/admin/dashboard/sellers_request'
    },
    {
        id: 8,
        title : 'Chat Seller',
        icon: <BsFillChatLeftTextFill/>,
        role: 'admin',
        path: '/admin/dashboard/chat_seller'
    },
]