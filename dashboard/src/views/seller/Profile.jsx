
import { FaImage } from "react-icons/fa";
import { FadeLoader } from 'react-spinners';
import { FaEdit } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { profile_image_upload, messageClear, profile_info_add,change_password } from '../../store/Reducers/authReducer';
import { create_stripe_connect_account } from '../../store/Reducers/sellerReducer';
import UploadIdCardModal from '../components/UploadCardModal';
import CaptureFaceImageModal from '../components/CaptureFaceImageModal';

const Profile = () => {
    const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
    const [isFaceImageModalOpen, setIsFaceImageModalOpen] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [state, setState] = useState({
        city: '',
        address: '',
        shopName: '',
        phoneNumber: ''
    });
    const dispatch = useDispatch();
    const { userInfo, loader, successMessage } = useSelector(state => state.auth);

    const [passwordState, setPasswordState] = useState({
        oldPassword: '',
        newPassword: '',
    });

    const handlePasswordChange = (e) => {
        setPasswordState({
            ...passwordState,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitPasswordChange = (e) => {
        e.preventDefault();
        if (!passwordState.oldPassword || !passwordState.newPassword) {
            toast.error('Please fill in all fields!');
            return;
        }
        dispatch(
            change_password({
                sellerId: userInfo._id,
                email: userInfo.email,
                oldPassword: passwordState.oldPassword,
                newPassword: passwordState.newPassword,
            })
        );
    };
   
    const add_image = (e) => {
        if (e.target.files.length > 0) {
            const formData = new FormData();
            formData.append('image', e.target.files[0]);
            dispatch(profile_image_upload(formData));
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            messageClear();
        }
    }, [successMessage]);

    const add = (e) => {
        e.preventDefault();
        dispatch(profile_info_add(state));
        setIsEditing(false);
    };

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const handleEditClick = () => {
        setState({
            city: userInfo.shopInfo?.city || '',
            address: userInfo.shopInfo?.address || '',
            shopName: userInfo.shopInfo?.shopName || '',
            phoneNumber: userInfo.shopInfo?.phoneNumber || ''
        });
        setIsEditing(true);
    };

    return (
        <div className='px-2 lg:px-7 py-5'>
            <div className='w-full flex flex-wrap'>
                <div className='w-full md:w-6/12'>
                    <div className='w-full p-4 bg-[#283046] rounded-md text-[#d0d2d6]'>
                        <div className='flex justify-center items-center py-3'>
                            {userInfo?.image ? 
                                <label htmlFor="img" className='h-[210px] w-[300px] relative p-3 cursor-pointer overflow-hidden'>
                                    <img src={userInfo.image} alt='' />
                                    {loader && 
                                        <div className='bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20'>
                                            <span><FadeLoader /></span>
                                        </div>
                                    }
                                </label> 
                                : 
                                <label htmlFor="img" className='flex justify-center items-center flex-col h-[210px] w-[300px] cursor-pointer border border-dashed hover:border-indigo-500 border-[#d0d2d6] relative'>
                                    <span><FaImage /></span>
                                    <span>Select Image</span>
                                    {loader && 
                                        <div className='bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20'>
                                            <span><FadeLoader/></span>
                                        </div>
                                    }
                                </label>
                            }
                            <input onChange={add_image} type="file" className='hidden' id='img' />
                        </div>
                        <div className='px-0 md:px-5 py-2'>
                            <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative'>
                                <div className='flex gap-2'>
                                    <span>Name : </span>
                                    <span>{userInfo.name}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Email : </span>
                                    <span>{userInfo.email}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Role : </span>
                                    <span>{userInfo.role}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Status : </span>
                                    <span>{userInfo.status}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Payment Account : </span>
                                    <p>
                                        {
                                            userInfo.payment === 'active' ? 
                                                <span className='bg-red-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded '>{userInfo.payment}</span> : 
                                                <span onClick={() => dispatch(create_stripe_connect_account())} className='bg-blue-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded '>
                                                    click active
                                                </span>
                                        }
                                    </p>
                                </div>
                                <div>
                                <div className="flex gap-2">
                                    <span>ID Card Status: </span>
                                    <p>
                                        {userInfo?.idCardImages && userInfo?.idCardImages.length > 0 ? (
                                        <span className="bg-green-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded">Verified</span>
                                        ) : (
                                        <span
                                            onClick={() => setIsIdCardModalOpen(true)}
                                            className="bg-blue-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded"
                                        >
                                            Not available
                                        </span>
                                        )}
                                    </p>
                                </div>

                                <UploadIdCardModal 
                                    isOpen={isIdCardModalOpen} 
                                    onRequestClose={() => setIsIdCardModalOpen(false)} 
                                    onUpload={() => setIsIdCardModalOpen(false)} 
                                />
                            </div>
                            <div>
                                <div className='flex gap-2'>
                                    <span>Face Image: </span>
                                    <p>
                                        {userInfo?.faceImage ? 
                                            <span className='bg-green-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded'>Verified</span> : 
                                            <span onClick={() => setIsFaceImageModalOpen(true)} className='bg-blue-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded'>Not available</span>
                                        }
                                    </p>
                                </div>
                                <CaptureFaceImageModal
                                    isOpen={isFaceImageModalOpen} 
                                    onRequestClose={() => setIsFaceImageModalOpen(false)} 
                                    onUpload={() => setIsFaceImageModalOpen(false)} 
                                />
                            </div>

                            </div>
                        </div>
                        <div className='px-0 md:px-5 py-2'>
                            {
                                !userInfo?.shopInfo ? 
                                <form onSubmit={add}>
                                    <div className='flex flex-col w-full gap-1 mb-3'>
                                        <label htmlFor="ShopName">Shop Name</label>
                                        <input value={state.shopName} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" placeholder='Shop name' name='shopName' id='shopName' />
                                    </div>
                                    <div className='flex flex-col w-full gap-1 mb-3'>
                                        <label htmlFor="Phone">Phone Number</label>
                                        <input value={state.phoneNumber} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="tel" placeholder='Phone number' name='phoneNumber' id='phoneNumber' />
                                    </div>
                                    <div className='flex flex-col w-full gap-1 mb-3'>
                                        <label htmlFor="Address">Address</label>
                                        <input value={state.address} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" placeholder='Address' name='address' id='address' required />
                                    </div>
                                    <div className='flex flex-col w-full gap-1 mb-3'>
                                        <label htmlFor="City">City</label>
                                        <input value={state.city} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" placeholder='City' name='city' id='city' required />
                                    </div>
                                    <div className='flex'>
                                        <button disabled={loader ? true : false} className='bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                                            {
                                                loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Update Info'
                                            }
                                        </button>
                                    </div>
                                </form> : 
                                <>
                                    {!isEditing ? (
                                        <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative'>
                                            <span className='p-[6px] bg-blue-500 rounded hover:shadow-lg hover:shadow-blue-500/50 absolute right-2 top-2 cursor-pointer' onClick={handleEditClick}><FaEdit/></span>
                                            <div className='flex gap-2'>
                                                <span>Shop Name : </span>
                                                <span>{userInfo.shopInfo.shopName}</span>
                                            </div>
                                            <div className='flex gap-2'>
                                                <span>Phone Number : </span>
                                                <span>{userInfo.shopInfo.phoneNumber}</span>
                                            </div>
                                            <div className='flex gap-2'>
                                                <span>Address : </span>
                                                <span>{userInfo.shopInfo.address}</span>
                                            </div>
                                            <div className='flex gap-2'>
                                                <span>City : </span>
                                                <span>{userInfo.shopInfo.city}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={add}>
                                            <div className='flex flex-col w-full gap-1 mb-3'>
                                                <label htmlFor="ShopName">Shop Name</label>
                                                <input value={state.shopName} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" placeholder='Shop name' name='shopName' id='shopName' />
                                            </div>
                                            <div className='flex flex-col w-full gap-1 mb-3'>
                                                <label htmlFor="Phone">Phone Number</label>
                                                <input value={state.phoneNumber} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="tel" placeholder='Phone number' name='phoneNumber' id='phoneNumber' />
                                            </div>
                                            <div className='flex flex-col w-full gap-1 mb-3'>
                                                <label htmlFor="Address">Address</label>
                                                <input value={state.address} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" placeholder='Address' name='address' id='address' required />
                                            </div>
                                            <div className='flex flex-col w-full gap-1 mb-3'>
                                                <label htmlFor="City">City</label>
                                                <input value={state.city} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" placeholder='City' name='city' id='city' required />
                                            </div>
                                            <div className='flex'>
                                                <button disabled={loader ? true : false} className='bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                                                    {
                                                        loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Update Info'
                                                    }
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className='w-full md:w-6/12'>
                     <div className='w-full pl-0 md:pl-7 mt-6 md:mt-0'>
                         {/* <div className='bg-[#283046] rounded-md text-[#d0d2d6] p-4'>
                             <h1 className='text-[#d0d2d6] text-lg mb-3 font-semibold'>Change Password</h1>
                             <form>
                                 <div className='flex flex-col w-full gap-1 mb-3'>
                                     <label htmlFor="email">Email</label>
                                     <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="email" placeholder='email' name='email' id='email' autoComplete="email" />
                                 </div>
                                 <div className='flex flex-col w-full gap-1'>
                                     <label htmlFor="o_password">Old Password</label>
                                     <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="password" placeholder='old password' name='old-password' id='old-password' autoComplete="current-password"/>
                                 </div>
                                 <div className='flex flex-col w-full gap-1'>
                                     <label htmlFor="n_password">New Password</label>
                                     <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="password" placeholder='new password' name='new-password' id='new-password' autoComplete="new-password" />
                                 </div>
                                 <button className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 mt-5'>Submit</button>
                             </form>
                         </div> */}
                         <h2 className="text-2xl font-bold text-center text-white mb-4">Change Password</h2>
            <form
                onSubmit={handleSubmitPasswordChange}
                className="p-4 bg-slate-800 rounded-md shadow-md"
            >
                <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="oldPassword" className="text-sm text-gray-400">
                        Old Password
                    </label>
                    <input
                        type="password"
                        name="oldPassword"
                        id="oldPassword"
                        value={passwordState.oldPassword}
                        onChange={handlePasswordChange}
                        className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                        placeholder="Enter your old password"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="newPassword" className="text-sm text-gray-400">
                        New Password
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={passwordState.newPassword}
                        onChange={handlePasswordChange}
                        className="px-4 py-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                        placeholder="Enter your new password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full py-2 rounded-md text-white ${
                        loader
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50'
                    }`}
                    disabled={loader}
                >
                    {loader ? 'Processing...' : 'Change Password'}
                </button>
            </form>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default Profile;
