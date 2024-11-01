import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { change_password } from '../../store/reducers/authReducer';

const ChangePassword = () => {
  // const dispatch = useDispatch();
  // const [formData, setFormData] = useState({
  //   email: '',
  //   old_password: '',
  //   new_password: ''
  // });

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value
  //   });
  // };

  // const handleSubmit = () => {
  //   dispatch(change_password(formData));
  // };

  return (
    <div className='p-4 bg-white'>
      <h2 className='text-xl text-slate-600 pb-5'>Change Password</h2>
      <form>
        <div className='flex flex-col gap-1 mb-2'>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id='email'
            name='email'
            placeholder='Enter your email'
            className='outline-none px-3 py-1 border rounded-md text-slate-600'
            // onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-1 mb-2'>
          <label htmlFor="old_password">Old Password</label>
          <input
            type="password"
            id='old_password'
            name='old_password'
            placeholder='Old password'
            className='outline-none px-3 py-1 border rounded-md text-slate-600'
            // onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-1 mb-2'>
          <label htmlFor="new_password">New Password</label>
          <input
            type="password"
            id='new_password'
            name='new_password'
            placeholder='New password'
            className='outline-none px-3 py-1 border rounded-md text-slate-600'
            // onChange={handleChange}
          />
        </div>
        <div>
          <button
            type="button"
            // onClick={handleSubmit}
            className='px-8 py-2 bg-purple-500 shadow-lg hover:shadow-purple-500/30 text-white rounded-md'
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
