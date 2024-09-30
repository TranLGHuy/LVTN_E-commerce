import React, { useEffect , useState} from 'react'
import {Link , useLocation} from 'react-router-dom'
import { getNavs } from '../Navigation/index'
const Sidebar = () => {
    const {pathname} = useLocation()
    const [allNav,setAllNav] = useState([])
    useEffect(()=>{
        const navs = getNavs('admin')
        setAllNav(navs)
    },[])
    console.log(pathname)
    return (
    <div>
      <div></div>
      <div className={`w-[260px] fixed bg-[#283046] z-50 top-0 h-screen shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] transition-all`}>
        <div className='h-[70px] flex justify-center items-center'>
            <Link  to='/'className='w-[180px] h-[50px]'>
            <img src="http://localhost:3000/images/logo.png" alt=""/>
            </Link>
        </div>
        <div className='px-[16px] pt-[15px]'>
            <div>
                
            </div>
            <ul>
                {
                    allNav.map((n,i)=><li key={i}>
                        <Link to={n.path} className={`${pathname === n.path ? 'bg-[#464c5e] shadow-indigo-500/50 text-white duration-500' : 'text-[#d0d2d6] font-normal duration-200'} px-[12px] pt-[15px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1`}>
                        <span>{n.icon}</span>
                        <span>{n.title}</span>
                        </Link>
                    </li>)
                }
            </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
