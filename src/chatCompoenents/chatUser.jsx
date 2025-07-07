import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import AppContext from '../context/appContext';
import GroupName from "../assets/groupName.png"
import oneToOne from "../assets/oneToOne.png"

const ChatUser = () => {
    const API = import.meta.env.VITE_BACKEND_URL;
    const [usersDetail, setUsersDetail] = useState([]);
    const user = useContext(AppContext);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchAllUser = async () => {
            try {
                const res = await axios.get(`${API}/auth/all`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });


                const filtered = res.data.filter(
                    (det) => det._id !== user.user.user._id
                );

                setUsersDetail(filtered);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchAllUser();
    }, [API, user.user._id]);
    const handleClick = async (userId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${API}/chat`,
                { userId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Accessed/Created Chat:", res.data);
            window.location.reload();
            // You can now set this chat to context or redirect to chat screen
        } catch (err) {
            console.error("Error accessing chat:", err);
        }
    };

    return (
        <div>
            <ListGroup variant="flush" className="chat-list px-2">
                {usersDetail.map((u) => (
                    <ListGroup.Item
                        key={u._id}
                        className="d-flex align-items-center gap-3 py-3 border-bottom rounded "
                        style={{
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#cd6731")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        onClick={() => handleClick(u._id)}

                    >
                        <img
                            src={u.profile ? u.profile : GroupName}
                            alt="user-profile"
                            style={{
                                height: "45px",
                                width: "45px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #e0e0e0",
                            }}
                        />
                        <div>
                            <div style={{ fontWeight: "600", fontSize: "1rem", color: "#333" }}>
                                {u.name || u.userId}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#888" }}>
                                {u.email || "Click to chat"}
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

        </div>
    );
};

export default ChatUser;
