import React, { useState, useEffect, useContext } from 'react';
import ChatUI from './chat';
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { Send } from "react-bootstrap-icons";
import forPoster from "../assets/forPoster.png"
import axios from 'axios';
import AppContext from '../context/appContext';
import EmojiPicker from 'emoji-picker-react';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { io } from "socket.io-client";
import GroupName from "../assets/groupName.png"
import oneToOne from "../assets/oneToOne.png";
import { formatforChat, formatLastSeen } from "../assets/formatedData";
import "./chat.css"
const socket = io("http://localhost:5000");







const ChatPage = ({ messages, setMessages, chatId, chats }) => {
    const [newMessage, setNewMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const API = import.meta.env.VITE_BACKEND_URL;
    const { user, receiver, receiverDetails, onlineUsers } = useContext(AppContext);

    const isReceiverOnline = receiver && onlineUsers.includes(receiver._id);


    const bioData = chats.filter(chat => chat._id === chatId);
    console.log(bioData);
    console.log("chats")
    useEffect(() => {
        const chatContainer = document.getElementById("chat-scroll-container");
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]); // Runs when messages change


    const handleSend = async () => {
        if (newMessage.trim() === "") return;
        // const token = localStorage.getItem("token");
        // setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me" }]);

        console.log(user)

        // const body = { chatId: chatId, content: newMessage, messageType: "text" }


        try {
            // await axios.post(`${API}/message`, body, {
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${token}`
            //     }
            // });
            const bodyData = { to: receiver, from: user.user._id, message: newMessage, chatId: chatId, messageType: "text" }
            if (!bioData[0].isGroupChat) {
                console.log("ok ray")
                socket.emit("send-msg", bodyData)
            }
            else {
                console.log("group Message")
                socket.emit("send-group-msg", bodyData)
            }
            setNewMessage("");
            setShowEmojiPicker(false);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleEmojiClick = (emojiData) => {
        setNewMessage(prev => prev + emojiData.emoji);
    };

    return (
        <div className="container-fluid d-flex flex-column h-100" style={{ width: "1155px" }}>
            {/* Header */}
            <div className="border-bottom p-3 bg-primary text-light rounded">
                <div className='d-flex flex-row align-items-center'>
                    {bioData[0] && (
                        <>
                            <div className="avatar-wrapper position-relative d-inline-block">
                                <img
                                    style={{
                                        height: "40px",
                                        width: "40px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                    src={
                                        bioData[0].isGroupChat
                                            ? bioData[0].groupProfile || oneToOne
                                            : receiverDetails.profile || GroupName
                                    }
                                    alt="chat-avatar"
                                />
                                {!bioData[0].isGroupChat && onlineUsers.includes(receiverDetails._id) && (
                                    <span className="online-indicator"></span>
                                )}
                            </div>

                            <div>
                                <h6 className="mb-0 ms-2">
                                    {bioData[0].isGroupChat
                                        ? bioData[0].name
                                        : receiverDetails.userId || "Unknown User"}
                                </h6>
                                <small className="fall-in-text text-muted d-block m-1 ml-2">
                                    {onlineUsers.includes(receiverDetails._id) ? "   online" : formatLastSeen(bioData[0].updatedAt)}
                                </small>
                            </div>

                        </>
                    )}
                </div>

            </div>

            {/* Scrollable Chat Messages */}
            <div id="chat-scroll-container" className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-3 chat-scroll"
                style={{ backgroundColor: "#fffaf5" }}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`px-3 py-2 rounded w-auto ${user.user._id === msg.sender._id
                            ? "align-self-end bg-primary text-white"
                            : "align-self-start bg-light"
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="position-absolute mb-2" style={{ bottom: "70px", zIndex: 10 }}>
                    <EmojiPicker onEmojiClick={handleEmojiClick} height={300} width={300} />
                </div>
            )}

            {/* Input Section */}
            <div className="p-3 bg-white border-top position-relative">
                <InputGroup>
                    <Button
                        variant="light"
                        className="rounded-circle me-2"
                        style={{ width: "50px", height: "50px" }}
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}

                    ><AddReactionIcon />
                    </Button>

                    <Form.Control
                        placeholder="Type a message..."
                        className="rounded-pill"
                        style={{ paddingLeft: "20px", paddingRight: "50px" }}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button
                        variant="primary"
                        className="mt-1 rounded-circle ms-2 d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px" }}
                        onClick={handleSend}
                    >
                        <Send />
                    </Button>
                </InputGroup>
            </div>
        </div>
    );
};





const PostPage = () => {
    console.log("sanjai");

    return (
        <div
            className="container-fluid d-flex flex-column align-items-center"
            style={{ width: "1155px", backgroundColor: "#fce7dd" }}
        >
            <div className="d-flex justify-content-center w-100">
                <img
                    className="img-fluid"
                    src={forPoster}
                    alt="Poster"
                    style={{ maxWidth: "900px", height: "700px" }}
                />
            </div>

            <h4
                className="text-dark text-center mt-3"
                style={{
                    position: "relative",
                    top: "-250px",
                    width: "50%",
                }}
            >
                Make Connection With Your Nearby Campus
            </h4>
        </div>
    );
};






const Grop = () => {
    const { user } = useContext(AppContext);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isMessage, setIsMessage] = useState(false);
    const [chatId, setChatId] = useState();
    const { setOnlineUsers } = useContext(AppContext);

    const API = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        socket.emit("add-user", user.user._id);

        const handleOnlineUsers = (users) => {
            setOnlineUsers(users);
        };
        const handleMsgReceive = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };
        const handleReadReceipt = ({ chatId, messageId }) => {
            // update message read status in UI
        };

        socket.on("online-users", handleOnlineUsers);
        socket.on("msg-receive", handleMsgReceive);
        socket.on("read-receipt", handleReadReceipt);

        return () => {
            socket.off("online-users", handleOnlineUsers);
            socket.off("msg-receive", handleMsgReceive);
            socket.off("read-receipt", handleReadReceipt);
        };
    }, []);


    useEffect(() => {
        const fetchMessages = async () => {
            console.log("chats")
            const token = localStorage.getItem("token")
            try {
                const response = await axios.get(`${API}/chat/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }); // change URL as needed
                setChats(response.data); // or set it in state

            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };

        fetchMessages();
    }, []);
    return (
        <Container fluid className="p-0 vh-100" style={{ backgroundColor: "#fce7dd" }}>
            <Row className="h-100 g-0 d-flex flex-row  ">
                <Col xs={4} sm={3} md={3} className=" bg-transparent p-0">
                    <ChatUI chats={chats} setChats={setChats} setMessages={setMessages} setIsMessage={setIsMessage} setChatId={setChatId} />
                </Col>
                <Col xs={8} sm={9} md={9} className="h-100 p-0">

                    {!isMessage ? <PostPage /> : <ChatPage messages={messages} setMessages={setMessages} chatId={chatId} chats={chats} />}



                </Col>


            </Row>
        </Container>
    );
};

export default Grop;
