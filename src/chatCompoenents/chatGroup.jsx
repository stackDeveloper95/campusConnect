import React, { useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import axios from 'axios';
import oneToOne from "../assets/oneToOne.png"

const ChatGroup = () => {
    const [community, setCommunity] = useState([]);
    const API = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const fetchProtectedData = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`${API}/community`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                setCommunity(res.data);
                console.log(res.data);


            }
            catch (err) {
                console.log(err)
            }
        }
        fetchProtectedData();

    }, [])

    return (
        <>
            <ListGroup variant="flush" className="chat-list px-2">

                {community.map((com) =>
                    <ListGroup.Item
                        id="chats"
                        style={{ userSelect: "none" }}
                        className={`d-flex justify-content-between align-items-center py-3 border-bottom rounded }`}
                    >
                        <div className="d-flex align-items-center">
                            <div className="avatar-circle me-3">
                                <div className="avatar-bg">
                                    <img
                                        style={{
                                            height: "50px",
                                            width: "50px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                        src={com.groupProfile ? com.groupProfile : oneToOne}
                                        alt="Group"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="fw-semibold text-dark">{com.name}</div>
                                <small className="text-secondary">
                                    {com.lastMessage?.content?.slice(0, 20)}
                                    {com.lastMessage?.content?.length > 20 ? "..." : ""}
                                </small>
                            </div>
                        </div>
                        
                    </ListGroup.Item>)}
            </ListGroup>
        </>
    )
}

export default ChatGroup