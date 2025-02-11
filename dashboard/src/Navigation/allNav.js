import { MdOutlineDashboard,MdOutlineShoppingBag,MdOutlineLogout } from "react-icons/md";
import { TfiDashboard } from "react-icons/tfi";
import { GrUserManager,GrProductHunt } from "react-icons/gr";
import { FaMoneyBillTransfer,FaCartPlus } from "react-icons/fa6";
import { LuUserX } from "react-icons/lu";
import { BiLoaderCircle } from "react-icons/bi";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { PiChatsBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { TbReportAnalytics } from "react-icons/tb";
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
        path: '/admin/dashboard/payment-request'
    },
    {
        id: 6,
        title : 'Deactive Seller',
        icon: <LuUserX/>,
        role: 'admin',
        path: '/admin/dashboard/deactive-sellers'
    },
    {
        id: 6,
        title : 'Report',
        icon: <TbReportAnalytics/>,
        role: 'admin',
        path: '/admin/dashboard/report'
    },
    {
        id: 7,
        title : 'Seller Request',
        icon: <BiLoaderCircle />,
        role: 'admin',
        path: '/admin/dashboard/sellers-request'
    },
    {
        id: 8,
        title : 'Chat Seller',
        icon: <BsFillChatLeftTextFill/>,
        role: 'admin',
        path: '/admin/dashboard/chat-seller'
    },
    {
        id: 9,
        title: 'Dashboard',
        icon: <TfiDashboard />,
        role: 'seller',
        path: '/seller/dashboard'
    },
    {
        id: 10,
        title: 'Add Product',
        icon: <FaCartPlus />,
        role: 'seller',
        path: '/seller/dashboard/add-product'
    },
    {
        id: 11,
        title: 'All Product',
        icon: <GrProductHunt />,
        role: 'seller',
        path: '/seller/dashboard/products'
    },

    {
        id: 12,
        title: 'Orders',
        icon: <FaShoppingCart />,
        role: 'seller',
        path: '/seller/dashboard/orders'
    },
    {
        id: 13,
        title: 'Payments',
        icon: <AiOutlineDollarCircle />,
        role: 'seller',
        path: '/seller/dashboard/payments'
    },
    {
        id: 14,
        title: 'Chat Customer',
        icon: <IoChatboxEllipsesOutline />,
        role: 'seller',
        path: '/seller/dashboard/chat-customer'
    },
    {
        id: 15,
        title: 'Chat Support',
        icon: <PiChatsBold />,
        role: 'seller',
        path: '/seller/dashboard/chat-support'
    },
    {
        id: 16,
        title: 'Profile',
        icon: <CgProfile />,
        role: 'seller',
        path: '/seller/dashboard/profile'
    },
]