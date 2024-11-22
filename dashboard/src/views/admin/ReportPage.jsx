import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsCurrencyDollar, BsCart3 } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa6";
import { get_admin_dashboard_index_data } from '../../store/Reducers/dashboardIndexReducer';
import { Line, Bar,Pie } from 'react-chartjs-2';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement,  Title, Tooltip, Legend);

const ReportPage = () => {
  const { userInfo } = useSelector(state => state.auth);
  const { totalSale, totalOrder, totalProduct, totalSeller } = useSelector(state => state.dashboardIndex);
  const { dailyRevenueData, ordersByMonth,ordersByProvinceString,orderStatusString } = useSelector(state => state.dashboardIndex);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_admin_dashboard_index_data());
  }, [dispatch]);
  const dailyRevenue = dailyRevenueData || [];
  const monthlyOrders = ordersByMonth || {};

  const parseOrdersByProvince = () => {
    if (!ordersByProvinceString) return [];
  
    const provinceData = ordersByProvinceString.split(',').map(item => {
      const [province, orderCount] = item.split(':').map(str => str.trim());
      return {
        province,
        orderCount: parseInt(orderCount.replace('đơn', '').trim(), 10),
      };
    });

    const topProvinces = provinceData.slice(0, 5);
    const otherProvinceData = provinceData.slice(5);
  
    if (otherProvinceData.length > 0) {
      const others = {
        province: 'Others',
        orderCount: otherProvinceData.reduce((acc, item) => acc + item.orderCount, 0),
      };
      topProvinces.push(others);
    }
  
    return topProvinces;
  };
  const parseOrderStatus = (orderStatusString) => {
    if (!orderStatusString) return [];
    
    // Tách chuỗi "Order Status Counts:" và lấy phần sau dấu ":".
    const statusData = orderStatusString.split('Order Status Counts:')[1]?.trim();
    if (!statusData) return [];

    // Tách các trạng thái theo dấu "," và xử lý từng trạng thái.
    const parsedData = statusData.split(',').map(item => {
      const [status, count] = item.split(':').map(str => str.trim());
      
      // Kiểm tra và chuyển count sang số hợp lệ
      const countNumber = parseInt(count, 10);
      return {
        status,
        count: isNaN(countNumber) ? 0 : countNumber // Nếu không phải số hợp lệ, gán 0
      };
    });

    // In kết quả sau khi tách ra
    console.log(parsedData);

    return parsedData;
  };

  const orderStatusData = parseOrderStatus(orderStatusString);
  const provinceData = parseOrdersByProvince();
  const pieChartData = {
    labels: provinceData.map(item => item.province),
    datasets: [
      {
        data: provinceData.map(item => item.orderCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)', // Màu cho phần "Others"
        ],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options for Pie chart
  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true, // Hiển thị tooltip khi hover
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} đơn`; // Tùy chỉnh nội dung của tooltip
          },
        },
      },
      legend: {
        position: 'right',
        labels: {
          color: '#000',
        },
      },
      title: {
        display: true,
        text: 'Số đơn hàng theo tỉnh/thành phố', // Tiêu đề biểu đồ
        font: {
          size: 18, // Kích thước chữ tiêu đề
        },
      },
    },
    hover: {
      onHover: function(e) {
        e.native.target.style.cursor = 'pointer'; // Thay đổi con trỏ chuột khi hover
      },
    },
    animation: {
      duration: 1000, // Thời gian animation
      easing: 'easeOutBounce', // Kiểu animation
    },
  };


  // Lọc doanh thu trong 10 ngày gần nhất và đảm bảo có 10 ngày
  const getLast10DaysRevenue = () => {
    const today = new Date();
    let last10Days = [];

    // Lấy doanh thu cho 10 ngày gần nhất
    for (let i = 9; i >= 0; i--) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i); // Tính ngày cụ thể (từ hôm nay lùi về 9 ngày)

      // Tìm doanh thu cho ngày này
      const revenueForDay = dailyRevenue.find(item => {
        const revenueDate = new Date(item._id); // Chuyển _id thành đối tượng Date
        return revenueDate.toDateString() === targetDate.toDateString();
      });

      // Nếu có doanh thu thì thêm vào, nếu không thì thêm giá trị 0
      last10Days.push({
        date: targetDate,
        dailyRevenue: revenueForDay ? revenueForDay.dailyRevenue : 0
      });
    }

    return last10Days;
  };

  const last10DaysRevenue = getLast10DaysRevenue();

  // Chart data for daily revenue
  const chartData = {
    labels: last10DaysRevenue.map(item => {
      const date = item.date;
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}`;
    }),
    datasets: [
      {
        label: 'Doanh Thu Theo Ngày',
        data: last10DaysRevenue.map(item => item.dailyRevenue),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

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
          color: '#000',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#000',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        // Điều chỉnh trục X để đảm bảo tất cả các tháng đều hiển thị
        type: 'category', // Đảm bảo trục X là loại category để hiển thị tháng
        labels: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ], // Nhãn tháng
      },
      y: {
        ticks: {
          color: '#000',
          font: {
            weight: 'bold',
          },
          callback: (value) => `${value}`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
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
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };
  

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#000',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#000',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#000',
          font: {
            weight: 'bold',
          },
          callback: (value) => `$ ${value}`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: '#ffffff',
  };

  return (
    <div>
      <div className='px-2 md:px-7 py-5'>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
          {/* Overview Cards */}
          <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
            <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
              <h2 className='text-3xl font-bold'>${totalSale}</h2>
              <span className='text-md font-medium'>Total Sales</span>
            </div>
            <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
              <BsCurrencyDollar className='text-[#e5fd0e] shadow-lg' />
            </div>
          </div>
          <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
            <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
              <h2 className='text-3xl font-bold'>{totalProduct}</h2>
              <span className='text-md font-medium'>Products</span>
            </div>
            <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
              <FaProductHunt className='text-[#e5fd0e] shadow-lg' />
            </div>
          </div>
          <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
            <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
              <h2 className='text-3xl font-bold'>{totalSeller}</h2>
              <span className='text-md font-medium'>Sellers</span>
            </div>
            <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
              <FaUserFriends className='text-[#e5fd0e] shadow-lg' />
            </div>
          </div>
          <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
            <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
              <h2 className='text-3xl font-bold'>{totalOrder}</h2>
              <span className='text-md font-medium'>Total Orders</span>
            </div>
            <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
              <BsCart3 className='text-[#e5fd0e] shadow-lg' />
            </div>
          </div>
        </div>
        {/* Line Chart for Daily Revenue */}
        <div className="w-full flex flex-wrap mt-7">
          <div className="w-full lg:w-6/12 lg:pr-3 mb-4 lg:mb-0">
            <div className="w-full bg-[#ffffff] p-4 rounded-md h-[250px]">
              <Line data={chartData} options={chartOptions} height={250} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 lg:pl-3">
            <div className="w-full bg-[#ffffff] p-4 rounded-md h-[250px]">
              <Bar data={barChartData} options={barChartOptions} height={250} />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-wrap mt-7">
          <div className="w-full lg:w-6/12 lg:pr-3 mb-4 lg:mb-0">
            <div className="w-full bg-[#ffffff] p-4 rounded-md h-[350px]">
              <Pie data={pieChartData} options={pieChartOptions} height={350} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 lg:pl-3">
            <div className="w-full bg-white p-6 rounded-lg shadow-lg ">
              <h4 className="font-semibold text-xl text-gray-800 mb-6">Order Status Overview</h4>
              <div className="space-y-6 ">
                {orderStatusData.length > 0 ? (
                  orderStatusData.map((status, index) => (
                    <div key={index} className="flex flex-col space-y-2 ">
                      {/* Display status and count */}
                      <div className="flex justify-between items-center text-sm font-medium text-gray-800">
                        <span className="capitalize">{status.status}</span>
                        <span className="text-gray-500">{status.count}</span>
                      </div>

                      {/* ProgressBar */}
                      <div className="w-full bg-[#f3f4f6] rounded-full overflow-hidden h-[12px]">
                        <div
                          className="h-[350px] bg-[#4CAF50]"
                          style={{
                            width: `${(status.count / Math.max(...orderStatusData.map(item => item.count))) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No order status data available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ReportPage;
