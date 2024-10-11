import React from 'react'
import Headers from '../components/Headers'
import Banner from '../components/Banners'
import Categories from '../components/Categories'
const Home = () => {
  return (
    <div className='w-full'>
        <Headers />
        <Banner />
        <div className='my-4'>
            <Categories/>
        </div>
    </div>
  )
}

export default Home
