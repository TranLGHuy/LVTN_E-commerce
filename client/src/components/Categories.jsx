import React ,{useState} from 'react'
import 'react-multi-carousel/lib/styles.css'
import Carousel from 'react-multi-carousel'
import { Link,useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
const Categories = () => {
    const navigate = useNavigate()
    const search = () => {
        navigate(`/products/search?category=${category}&&value=${searchValue}`)
    }
    const {categories} = useSelector(state => state.home)
    const [searchValue, setSearchValue] = useState('')
    const [category,setCategory] = useState('')
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
            items: 1
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
                
                categories.map((c, i) => (
                    <Link to={`/products?category=${c.name}`} className='h-[200px] border block' key={i}>
                        <div className='w-full h-full relative p-3'>
                            <img className='w-full h-full' src={c.image} alt='image' />
                            <div className='absolute bottom-6 w-full mx-auto font-bold left-0 flex justify-center items-center'>
                                <span className='py-[2px] px-6 bg-[#3330305d] text-white'>{c.name}</span>
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
