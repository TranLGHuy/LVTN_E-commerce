import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsCurrencyDollar ,BsCart3} from "react-icons/bs";
import { FaEye, FaUserFriends } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa6";
import { Line, Bar,Pie } from 'react-chartjs-2';
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import seller from '../../assets/seller.jpg'
import { get_admin_dashboard_index_data } from '../../store/Reducers/dashboardIndexReducer'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement,  Title, Tooltip, Legend);
const AdminDashboard = () => {
  const { userInfo } = useSelector(state => state.auth)
  const { totalSale,
      totalOrder,
      totalProduct,
      totalSeller,
      recentOrders,
      recentMessage ,
      ordersByMonth} = useSelector(state => state.dashboardIndex)
  const monthlyOrders = ordersByMonth || {};

  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(get_admin_dashboard_index_data())
  }, [])

  const getMonthlyOrders = (month) => {
    return monthlyOrders && monthlyOrders[month] ? monthlyOrders[month] : 0;
  };
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Đảm bảo biểu đồ chiếm hết không gian
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: '#707785',
        },
    
        type: 'category', 
        labels: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ], // Nhãn tháng
      },
      y: {
        ticks: {
          color: 'white',
          font: {
            weight: 'bold',
          },
          callback: (value) => `${value}`,
        },
        grid: {
          color: '#707785',
        },
        suggestedMin: 0, // Đảm bảo trục Y bắt đầu từ 0
      },
    },
  };
  
  // Chart data cho bar chart
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Nhãn tháng
    datasets: [
      {
        label: 'Số Đơn Hàng Theo Tháng',
        data: [
          getMonthlyOrders(1),  // January
          getMonthlyOrders(2),  // February
          getMonthlyOrders(3),  // March
          getMonthlyOrders(4),  // April
          getMonthlyOrders(5),  // May
          getMonthlyOrders(6),  // June
          getMonthlyOrders(7),  // July
          getMonthlyOrders(8),  // August
          getMonthlyOrders(9),  // September
          getMonthlyOrders(10), // October
          getMonthlyOrders(11), // November
          getMonthlyOrders(12), // December
        ],
        backgroundColor: 'yellow',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className='px-2 md:px-7 py-5'>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-3xl font-bold'>${totalSale}</h2>
                <span className='text-md font-medium'>Total Sales</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <BsCurrencyDollar className='text-[#e5fd0e] shadow-lg'/>
              </div>
            </div>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-3xl font-bold'>{totalProduct}</h2>
                <span className='text-md font-medium'>Products</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <FaProductHunt className='text-[#e5fd0e] shadow-lg'/>
              </div>
            </div>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-3xl font-bold'>{totalSeller}</h2>
                <span className='text-md font-medium'>Sellers</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <FaUserFriends className='text-[#e5fd0e] shadow-lg'/>
              </div>
            </div>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-3xl font-bold'>{totalOrder}</h2>
                <span className='text-md font-medium'>Orders</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <BsCart3 className='text-[#e5fd0e] shadow-lg'/>
              </div>
            </div>
        </div>
        <div className='w-full flex flex-wrap mt-7'>
          <div className='w-full lg:w-7/12 lg:pr-3'>
            <div className='w-full bg-[#283046] p-4 rounded-md h-[395px]'>
              <Bar data={barChartData} options={barChartOptions} height={350} />
            </div>
          </div>
          <div className='w-full lg:w-5/12 lg: pl-4 mt-6 lg:mt-0'>
            <div className='w-full bg-[#283046] p-4 rounded-md text-[#d0d2d6]'>
              <div className='flex justify-between items-center'>
                  <h2 className='font-semibold text-lg text-[#d0d2d6] pd-3'>Recent seller message</h2>
                  <Link to={`/admin/dashboard/chat-seller`} className='font-semibold text-sm text-[#d0d2d6]'>View All</Link>
              </div>
              <div className='flex flex-col gap-2 pt-6 text-[#d0d2d6]'>
                <ol className='relative border-1 border-slate-600 ml-4'>
                  {
                      recentMessage.map((m, i) => <li className='mb-3 ml-6'>
                          <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#00d1e848] rounded-full z-10'>
                              {
                                  m.senderId === userInfo._id ? <img className='w-full rounded-full h-full shadow-lg' src={userInfo.image} alt="" /> : <img className='w-full rounded-full h-full shadow-lg' src={seller} alt="" />
                              }
                          </div>
                          <div className='p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm'>
                              <div className='flex justify-between items-center mb-2'>
                                  <Link className='text-md font-normal'>{m.senderName}</Link>
                                  <time className='mb-1 text-sm font-normal sm:order-last sm:mb-0'>{moment(m.createdAt).startOf('hour').fromNow()}</time>
                              </div>
                              <div className='p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800'>
                                  {m.message}
                              </div>
                          </div>
                      </li>)
                  }
                </ol>

              </div>
            </div>
          </div>
        </div>
        <div className='w-full p-4 bg-[#283046] rounded-md mt-6'>
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold text-lg text-[#d0d2d6] pd-3'>Recent Orders</h2>
            <Link to={'/admin/dashboard/orders'} className='font-semibold text-sm text-[#d0d2d6]'>View All</Link>
          </div>
          <div className='relative overflow-x-auto'>
            <table className='w-full text-sm text-left text-[#d0d2d6]'>
                <thead className='text-sm  text-[#d0d2d6] uppercase border-b border-slate-700'>
                  <tr>
                    <th scope='col' className='py-3 px-4'>Order ID</th>
                    <th scope='col' className='py-3 px-4'>Price</th>
                    <th scope='col' className='py-3 px-4'>Payment Status</th>
                    <th scope='col' className='py-3 px-4'>Order Status</th>
                    <th scope='col' className='py-3 px-4'>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {
                      recentOrders.map((d, i) => <tr key={i}>
                          <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>#{d._id}</td>
                          <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>${d.price}</td>
                          <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                              <span  className='bg-green-500 text-white text-md cursor-pointer font-normal ml-2 px-2 py-0.5 rounded '>{d.delivery_status}</span>
                          </td>
                          <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap' >
                              <span className='bg-red-500 text-white text-md cursor-pointer font-normal ml-2 px-2 py-0.5 rounded '>{d.payment_status}</span>
                          </td>
                          <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'> 
                              <Link to={`/admin/dashboard/order/details/${d._id}`} className='p-[6px] w-[30px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50 flex justify-center items-center'>
                                  <FaEye />
                              </Link>
                          </td>
                      </tr>)
                  }
                  
                </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

export default AdminDashboard;
