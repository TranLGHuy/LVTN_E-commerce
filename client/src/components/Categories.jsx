import React from 'react'
import 'react-multi-carousel/lib/styles.css'
import Carousel from 'react-multi-carousel'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
const Categories = () => {
    const category = [
        "T-Shirts",
        "Jeans",
        "Dresses",
        "Jackets",
        "Shoes",
        "Hats",
        "Suits"
    ]
  const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 6
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 6
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 4
    },
    mobile: {
        breakpoint: { max: 768, min: 0 },
        items: 3
    },
    
}
  return (
    <div className='w-[87%] mx-auto relative'>
        <Carousel
            autoPlay={true}
            infinite={true}
            arrows={true}
            responsive={responsive}
            transitionDuration={500}
        >
            {
                
                category.map((c, i) => (
                    <Link className='h-[200px] border block' key={i} to='#'>
                        <div className='w-full h-full relative p-3'>
                            <img className='w-full h-full' src={`http://localhost:3000/images/category/${i+1}.jpg`} alt='image' />
                            <div className='absolute bottom-6 w-full mx-auto font-bold left-0 flex justify-center items-center'>
                                <span className='py-[2px] px-6 bg-[#3330305d] text-white'>{c}</span>
                            </div>
                        </div>
                    </Link>
                ))
            }
        </Carousel>
    </div>
  )
}
export default Categories
