import React from 'react'
import Headers from '../components/Headers'
import Banner from '../components/Banners'
import Categories from '../components/Categories'
import FeatureProducts from '../components/products/FeatureProducts'
import Products from '../components/products/Products'
const Home = () => {
  return (
    <div className='w-full'>
        <Headers />
        <Banner />
        <div className='my-4'>
            <Categories/>
        </div>
        <div className='py-[45px]'>
                <FeatureProducts/>
            </div>
    </div>
  )
}

export default Home
