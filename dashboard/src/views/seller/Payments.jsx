import React, { forwardRef, useEffect, useState ,useRef} from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'
import toast from 'react-hot-toast'
import moment from 'moment'
import { FixedSizeList as List } from 'react-window'
import { useSelector, useDispatch } from 'react-redux'
import Webcam from 'react-webcam'
import '../css/Modal.css';
import { get_seller_payment_details, send_withdrawal_request, messageClear } from '../../store/Reducers/PaymentReducer'
function handleOnWheel({deltaY}){
    console.log('handleOnWheel',deltaY)
}

const outerElementType = forwardRef((props,ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} />
))
const Payments = () => {
    const [amount, setAmount] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCameraVisible, setIsCameraVisible] = useState(true); 
    const [image, setImage] = useState(null)
    const webcamRef = useRef(null);
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)
    const { successMessage,
        errorMessage,
        loader,
        pendingWithdraws = [],
        successWithdraws = [],
        totalAmount,
        withdrawAmount,
        pendingAmount,
        availableAmount } = useSelector(state => state.payment)
    const Row = ({index,style}) => {
        return (
            <div style={style} className='flex text-sm'>
                <div className='w-[25%] p-2 whitespace-nowrap'>{index + 1 }</div>
                <div className='w-[25%] p-2 whitespace-nowrap'>${pendingWithdraws[index]?.amount}</div>
                <div className='w-[25%] p-2 whitespace-nowrap'>
                    <span className='py-[1px] px-[5px] bg-slate-700 text-blue-500 rounded-md text-xs'>{pendingWithdraws[index]?.status}</span>
                </div>
                <div className='w-[25%] p-2 whitespace-nowrap'>{moment(pendingWithdraws[index]?.createdAt).format('LL')}</div>
            </div>
        )
    }
    const Rows = ({ index, style }) => {
      return (
          <div style={style} className='flex text-sm'>
              <div className='w-[25%] p-2 whitespace-nowrap'>{index + 1}</div>
              <div className='w-[25%] p-2 whitespace-nowrap'>${successWithdraws[index]?.amount}</div>
              <div className='w-[25%] p-2 whitespace-nowrap'>
                  <span className='py-[1px] px-[5px] bg-slate-700 text-blue-500 rounded-md text-xs'>{successWithdraws[index]?.status}</span>
              </div>
              <div className='w-[25%] p-2 whitespace-nowrap'>{moment(successWithdraws[index]?.createdAt).format('LL')}</div>
          </div>
      )
  }

  useEffect(() => {
      dispatch(get_seller_payment_details(userInfo._id))
  }, [])

  useEffect(() => {
      if (successMessage) {
          toast.success(successMessage)
          dispatch(messageClear())
      }
      if (errorMessage) {
          toast.error(errorMessage)
          dispatch(messageClear())
      }
  }, [errorMessage, successMessage])
  const handleCaptureAndSubmit = async () => {
    if (isCameraVisible) {
        // Nếu camera đang hiển thị, chụp ảnh
        if (webcamRef.current) {
            const screenshot = webcamRef.current.getScreenshot();
            if (!screenshot) {
                toast.error('Please capture your face first.');
                return;
            }
            setImage(screenshot);
            setIsCameraVisible(false); // Ẩn camera sau khi chụp ảnh

            // Dừng webcam sau khi chụp ảnh
            webcamRef.current.video.srcObject.getTracks().forEach(track => track.stop());
            // console.log("Seller ID:", userInfo._id);
            // console.log("Image:",screenshot)
            // Gửi ảnh về server
            const response = await fetch('http://localhost:5001/api/verify-face', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: screenshot, sellerId: userInfo._id })
            });
            const result = await response.json();
            if (result.success) {
                setIsModalOpen(false);
                sendWithdrawalRequest();
            } else {
                toast.error('Face verification failed.');
            }
        }
    } else {
        // Nếu đã chụp ảnh, gửi ảnh về server
        const response = await fetch('/api/verify-face', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image, sellerId: userInfo._id })
        });
        const result = await response.json();
        if (result.success) {
            setIsModalOpen(false);
            sendWithdrawalRequest();
        } else {
            toast.error('Face verification failed.');
        }
    }
};

const handleRetake = () => {
    setImage(null); // Đặt lại hình ảnh về null để chuẩn bị chụp lại
    setIsCameraVisible(true); // Mở lại camera
    if (webcamRef.current) {
        webcamRef.current.video.srcObject.getTracks().forEach(track => track.start());
    }
};

const handleClose = () => {
    setImage(null); 
    setIsModalOpen(false); 
};

const sendWithdrawalRequest = () => {
    if (availableAmount - amount > 10) {
        dispatch(send_withdrawal_request({ amount, sellerId: userInfo._id }))
        setAmount(0)
    } else {
        toast.error('Insufficient balance')
    }
}
const openModal = () => setIsModalOpen(true);
  return (
    <div className='px-2 md:px-7 py-5'>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3'>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-lg font-bold'>${totalAmount}</h2>
                <span className='text-md font-normal'>Total Sales</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <BsCurrencyDollar className='text-[#e5fd0e] shadow-lg'/>
              </div>
            </div>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-lg font-bold'>${availableAmount}</h2>
                <span className='text-md font-normal'>Available Amount</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <BsCurrencyDollar className='text-[#b97949] shadow-lg'/>
              </div>
            </div>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-lg font-bold'>${withdrawAmount}</h2>
                <span className='text-md font-normal'>Withdraw Amount</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <BsCurrencyDollar className='text-[#8b3df9] shadow-lg'/>
              </div>
            </div>
            <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
              <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                <h2 className='text-lg font-bold'>${pendingAmount}</h2>
                <span className='text-md font-normal'>Pending Amount</span>
              </div>
              <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                <BsCurrencyDollar className='text-[#71c9df] shadow-lg'/>
              </div>
            </div>
        </div>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-3 pb-4 pt-5'>
                <div className='bg-[#283046]  text-[#d0d2d6] rounded-md p-5'>
                    <h2 className='text-lg'>Send withdrawal Request</h2>
                    <div className='py-5'>
                        <form onSubmit={(e) => { e.preventDefault(); openModal() }}>
                            <div className='flex gap-3 flex-wrap'>
                                <input onChange={(e) => setAmount(e.target.value)} required value={amount} min='0' type="number" className='px-3 md:w-[80%] py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' name='amount' />
                                <button onClick={openModal} type="submit" className='bg-indigo-500 hover:shadow-indigo-500/50 hover:shadow-lg text-white rounded-sm px-4 py-2 text-sm '>{loader ? 'Loading...' : 'Submit'}</button>
                            </div>
                        </form>
                    </div>
                    <div>
                        <h2 className='text-lg pb-4'>Pending withdrawal request</h2>
                        <div className='w-full overflow-x-auto'>
                            <div className='flex bg-[#161d31] uppercase text-xs min-w-[340px]'>
                                <div className='w-[25%] p-2'>No</div>
                                <div className='w-[25%] p-2'>Amount</div>
                                <div className='w-[25%] p-2'>status</div>
                                <div className='w-[25%] p-2'>date</div>
                            </div>
                            {
                                <List
                                    style={{ minWidth: '340px', overflowX: 'hidden' }}
                                    className='List'
                                    height={350}
                                    itemCount={pendingWithdraws.length}
                                    itemSize={35}
                                    outerElementType={outerElementType}
                                >
                                    {Row}
                                </List>
                            }
                    </div>
                </div>
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            {isCameraVisible && (
                                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
                            )}
                            {image && !isCameraVisible && (
                                <img src={image} alt="Captured" />
                            )}
                            <div className="button-container">
                                {image ? (
                                    <button className="bg-yellow-500 text-white rounded-lg px-4 py-2 hover:bg-yellow-600" onClick={handleRetake}>Chụp lại</button>
                                ) : (
                                    <button className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600" onClick={handleCaptureAndSubmit}>Chụp và Gửi</button>
                                )}
                                <button className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600" onClick={handleClose}>Đóng</button>
                            </div>
                        </div>
                    </div>
                )}
 
            </div>
            <div className='bg-[#283046]  text-[#d0d2d6] rounded-md p-5'>
                    <div>
                        <h2 className='text-lg pb-4'>Success Withdrawal</h2>
                        <div className='w-full overflow-x-auto'>
                            <div className='flex bg-[#161d31] uppercase text-xs min-w-[340px]'>
                                <div className='w-[25%] p-2'>No</div>
                                <div className='w-[25%] p-2'>Amount</div>
                                <div className='w-[25%] p-2'>status</div>
                                <div className='w-[25%] p-2'>date</div>
                            </div>
                            {
                                <List
                                    style={{ minWidth: '340px', overflowX: 'hidden' }}
                                    className='List'
                                    height={350}
                                    itemCount={successWithdraws.length}
                                    itemSize={35}
                                    outerElementType={outerElementType}
                                >
                                    {Rows}
                                </List>
                            }
                        </div>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default Payments
