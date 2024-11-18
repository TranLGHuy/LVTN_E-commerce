import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const ReportPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [citySalesData, setCitySalesData] = useState([]);
  const [month, setMonth] = useState('January');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSalesData([
        { seller: 'Seller 1', sales: 1000 },
        { seller: 'Seller 2', sales: 1200 },
        { seller: 'Seller 3', sales: 800 },
        { seller: 'Seller 4', sales: 1500 },
        { seller: 'Seller 5', sales: 1100 },
      ]);

      setCitySalesData([
        { city: 'Hanoi', totalSales: 5000 },
        { city: 'HCMC', totalSales: 7000 },
        { city: 'Da Nang', totalSales: 3000 },
        { city: 'Can Tho', totalSales: 2000 },
      ]);
      setIsLoading(false);
    }, 1000);
  }, [month, selectedCity]);

  const salesChartData = {
    labels: salesData.map((item) => item.seller),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map((item) => item.sales),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const cityChartData = {
    labels: citySalesData.map((item) => item.city),
    datasets: [
      {
        label: 'Total Sales',
        data: citySalesData.map((item) => item.totalSales),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-gradient-to-b from-[#1e3a8a] to-[#1e2025] min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">Báo Cáo Doanh Thu</h1>

      {/* Bộ lọc */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label htmlFor="month" className="block text-lg font-medium text-[#d0d2d6] mb-2">Chọn Tháng:</label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-4 py-2 bg-[#283046] text-white rounded-lg border border-[#39404a]"
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December',
            ].map((m, i) => (
              <option key={i} value={m}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="block text-lg font-medium text-[#d0d2d6] mb-2">Chọn Thành Phố:</label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-4 py-2 bg-[#283046] text-white rounded-lg border border-[#39404a]"
          >
            <option value="All Cities">Tất cả các thành phố</option>
            <option value="Hanoi">Hà Nội</option>
            <option value="HCMC">TP.HCM</option>
            <option value="DaNang">Đà Nẵng</option>
            <option value="CanTho">Cần Thơ</option>
          </select>
        </div>
      </div>

      {/* Biểu đồ */}
      {isLoading ? (
        <p className="text-center text-white text-xl">Đang tải dữ liệu...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#283046] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Doanh Thu Theo Seller (Tháng {month})</h2>
            <Line data={salesChartData} />
          </div>

          <div className="bg-[#283046] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Doanh Thu Theo Thành Phố</h2>
            <Bar data={cityChartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
