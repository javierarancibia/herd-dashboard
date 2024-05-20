import React, { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTopHelper: React.FC<{children: ReactNode}> = ({ children }) => {
    // Function wrapper to scroll to top when path location changes
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [ pathname ])
    return children;
}

export default ScrollToTopHelper;
