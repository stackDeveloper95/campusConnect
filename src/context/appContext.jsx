import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context with default values
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const API = import.meta.env.VITE_BACKEND_URL;
    const [user, setUser] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const [receiverDetails, setReceiverDetails] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const fetchProtectedData = async () => {
            const token = localStorage.getItem("token");


            try {
                const res = await axios.get(`${API}/auth/protected`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(res.data)
                console.log(res.data)


            } catch (error) {
                console.error(error);

            }
        };

        fetchProtectedData();
    }, []); // <-- run only on component mount

    return (
        <AppContext.Provider value={{ user, setUser, setReceiver, receiver, receiverDetails, setReceiverDetails, onlineUsers, setOnlineUsers }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;


