import React from 'react'
import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
const ProtectRoute = ({ route, children }) => {
    const { role, userInfo } = useSelector(state => state.auth);
    
    // Nếu chưa có role
    if (!role) {
        return <Navigate to='/login' replace />;
    }

    // Nếu có userInfo
    if (userInfo) {
        if (route.role) {
            if (userInfo.role === route.role) {
                if (route.status) {
                    if (route.status === userInfo.status) {
                        return <Suspense fallback={null}>{children}</Suspense>;
                    } else {
                        return userInfo.status === 'pending'
                            ? <Navigate to='/seller/account-pending' replace />
                            : <Navigate to='/seller/account-deactive' replace />;
                    }
                } else {
                    if (route.visibility) {
                        if (route.visibility.some(r => r === userInfo.status)) {
                            return <Suspense fallback={null}>{children}</Suspense>;
                        } else {
                            return <Navigate to='/seller/account-pending' replace />;
                        }
                    } else {
                        return <Suspense fallback={null}>{children}</Suspense>;
                    }
                }
            } else {
                return <Navigate to='/' replace />;
            }
        } else if (route.ability === 'seller') {
            return <Suspense fallback={null}>{children}</Suspense>;
        }
    } else {
        return <Navigate to='/' replace />;
    }
}


export default ProtectRoute