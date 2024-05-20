import React, { createContext, useContext, ReactNode, useState } from 'react'
import useLocalStorage from "../useLocalStorage"
import { useNavigate } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';

type User = {
    email: string | undefined | null,
    emailConfirmed: boolean | undefined | null,
    expirationTime: string | undefined | null,
    roles: string[] | undefined | null,
    token: string | undefined | null,
    twoFactorEnabled: boolean | undefined | null
}

type Inputs = { 
    email: string, 
    password: string 
};

type AxiosOptionsType = AxiosRequestConfig;

type AuthContextType = {
    clientUser: User | null,
    setClientUser: (value: User | null) => void,
    apiUrl: string,
    setApiUrl: (value: string) => void,
    googleClientId: string,
    setGoogleClientId: (value: string) => void,
    googleLoginFn: (value: string | undefined) => void,
    login: (value: Inputs) => void,
    logout: () => void,
    axiosOptions: AxiosOptionsType,
    setAxiosOptions: (value: AxiosOptionsType) => void
};


// Timer to refresh token
// let tokenResetTimer: any;

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    // States
    const [ clientUser, setClientUser ] = useLocalStorage<User | null>("user", null)
    const [ apiUrl, setApiUrl ] = useState<string>("")
    const [ googleClientId, setGoogleClientId ] = useState<string>("")
    const [ axiosOptions, setAxiosOptions ] = useState<AxiosOptionsType>({})
    // -- States

    const navigate = useNavigate()

    // Function to refresh token when expires
    // const refreshToken = (timeToExpire: number) => { 
    //     // Clear previous timer first
    //     clearTimeout(tokenResetTimer)
    
    //     tokenResetTimer = setTimeout(() => {
    //         return axios.get("")
    //         .then(res => {
    //             storeUser(res.data)
    //         })
    //     }, timeToExpire)
    // }

    const login = (data: Inputs) => {
        return data
        // .then(res => {
        //     if (res.data) {
        //         const user: User = {
        //             email: res.data.email,
        //             emailConfirmed: res.data.emailConfirmed,
        //             expirationTime: res.data.expirationTime,
        //             roles: res.data.roles,
        //             token: res.data.token,
        //             twoFactorEnabled: res.data.twoFactorEnabled
        //         };
        //         storeUser(user)
        //         return navigate("/main/accounts")
        //     }
        //     }).catch((error: any) => console.log(error))
    }

    
    // Get miliseconds to expiration date to set timeout
    // const getTimeToRefresh = (expirationTime: number) => {
    //     const expirationTimestamp = new Date(expirationTime * 1000).getTime()
    //     const now = new Date().getTime()
    //     return expirationTimestamp - now - 30000
    // }

    // Function to store user in Local Storage
    // const storeUser = (data: any) => {

    //     // Refresh the user info, it is changed
    //     if (clientUser !== data) { 
    //         setClientUser(data)
    //     }

    //     // Check if the user is null, logout
    //     if (data === null || data === undefined) {
    //         // Remove the axios Authorization token
    //         clearTimeout(tokenResetTimer)
    //         delete axios.defaults.headers.common['Authorization']
    //     } else {
    //         // Set the Axios Authorization token and start the refresh
    //         setAxiosOptions({ ...axiosOptions, headers: { Authorization: data.token } })
    //         // refreshToken(getTimeToRefresh(data.expirationTime)) // Call function to refresh in x miliseconds based on expiration time
    //     }
    // }

    // Google OAuthentication Login
    const googleLoginFn = (credential: string | undefined) => {
        // ({ provider: "Google", token: credential }).then(res => {
        // if (res.data) {
        //     const user: User = {
        //         email: res.data.email,
        //         emailConfirmed: res.data.emailConfirmed,
        //         expirationTime: res.data.expirationTime,
        //         roles: res.data.roles,
        //         token: res.data.token,
        //         twoFactorEnabled: res.data.twoFactorEnabled
        //     };
            // storeUser(user)
            return navigate("/main/accounts")
        // }
        // }).catch((error: any) => console.log(error))
    }

    // Logout function
    const logout = () => {
        setClientUser(null)
        return navigate('/')
        // .then(() => {
        //     setClientUser(null)
        //     navigate('/')            
        // }).catch((error) => console.log(error))
    }

    return (
        <AuthContext.Provider value={{ clientUser, setClientUser, apiUrl, setApiUrl, googleClientId, setGoogleClientId, googleLoginFn, login, logout, axiosOptions, setAxiosOptions }}>
            { children }
        </AuthContext.Provider>
    ) 
}

const useAuth = () => useContext(AuthContext)
export default useAuth;