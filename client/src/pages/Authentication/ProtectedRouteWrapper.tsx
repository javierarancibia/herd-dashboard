import React, { ReactNode } from 'react'
import useAuth from '../../hooks/Auth/useAuth'
import { Navigate } from 'react-router-dom'

const ProtectedRouteWrapper: React.FC<{children: ReactNode}> = ({ children }) => {
    const auth = useAuth()
    // if (auth?.clientUser === null ||auth?.clientUser === undefined) {
    //     return <Navigate to="/" />
    // }
    return children;
}

export default ProtectedRouteWrapper;
