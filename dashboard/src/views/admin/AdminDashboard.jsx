import React from 'react'
import { BsCurrencyDollar ,BsCart3} from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa6";
import Chart from "react-apexcharts";
const AdminDashboard = () => {

  const state ={
    series : [
      {
        name: "Orders",
        data: [30,60,20,24,15,19,28,30,41]
      },
      {
        name: "Revenue",
        data: [15,30,20,50,15,22,28,35,60]
      },
      {
        name: "Sellers",
        data: [10,35,27,40,15,24,35,35,50]
      },
    ],
    options: {
      color:['#181ee8','#181ee8'],
      plotOptions: {
        radius : 30
      },
      chart : {
        background : 'transparent',
        foreColor : '#d0d2d6'
      },
      dataLabels : {
        enabled : false
      },
      stroke : {
        show : true,
        curve : ['smooth', 'straight','stepline'],
        lineCap: 'butt',
        colors: '#f0f0f0',
        width: .5,
        dashArray: 0
      },
      xaxis : {
        categories : ['Jan','Feb','Mar','Apl','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      },
      legend: {
        position : 'top'
      },
      responsive : [
        {
          breakpoint : 565,
          yaxis : {
            categories : ['Jan','Feb','Mar','Apl','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
          },
          options : {
            plotOptions: {
              bar: {
                horizontal : true
              }
            },
            chart : {
              height : '550px'
            }
          }
        }  
      ]
    }
  }
  return (
    <div className='px-2 md:px-7 py-5'>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-3xl font-bold'>$5000</h2>
                <span className='text-md font-medium'>Total Sales</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <BsCurrencyDollar className='text-[#e5fd0e] shadow-lg'/>
              </div>
            </div>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-3xl font-bold'>10</h2>
                <span className='text-md font-medium'>Products</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <FaProductHunt className='text-[#e5fd0e] shadow-lg'/>
              </div>
            </div>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-3xl font-bold'>5</h2>
                <span className='text-md font-medium'>Sellers</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <FaUserFriends className='text-[#e5fd0e] shadow-lg'/>
              </div>
            </div>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-3xl font-bold'>10</h2>
                <span className='text-md font-medium'>Orders</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <BsCart3 className='text-[#e5fd0e] shadow-lg'/>
              </div>
            </div>
        </div>
        <div className='w-full flex flex-wrap mt-7'>
          <div className='w-full lg:w-7/12 lg:pr-3'>
            <div className='w-full  bg-[#283046] p-4 rounded-md'>
                  <Chart options={state.options} series={state.series} type='bar' height={350} />
            </div>
          </div>
          <div className='w-full lg:w-5/12 lg: pl-4 mt-6 lg:mt-0'>
            <div className='w-full bg-[#283046] p-4 rounded-md text-[#d0d2d6]'>
              <div className='flex justify-center items-center'>
                  <h2 className='font-semibold'>Recent seller message</h2>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AdminDashboard
