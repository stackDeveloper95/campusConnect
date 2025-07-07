import React, { useState } from "react";
import { Container, Row, Col, Nav, Badge, ListGroup, Image } from "react-bootstrap";
import campusConnect from "../assets/campusConnect.png"
import "./chat.css"
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';
import ChatUser from "./chatUser";
import ChatGroup from "./chatGroup";
import GroupName from "../assets/groupName.png"
import { useContext } from "react";
import AppContext from "../context/appContext";
import { formatforChat, formatLastSeen } from "../assets/formatedData";


const ChatUI = ({ chats, setChats, setMessages, setIsMessage, setChatId }) => {
    const uri = "https://sp.yimg.com/ib/th?id=OIP.koeZfshBa8121bb-HtN7nQHaLH&pid=Api&w=148&h=148&c=7&dpr=2&rs=1";
    // const chats = [
    //     { name: "Ahmad Franci", message: "Hey, what r u doing??", time: "12:45 PM", unread: 3, avatar: uri },
    //     { name: "Maria George", message: "Oh...thank you so much...", time: "11:30 AM", unread: 2, avatar: uri },
    //     { name: "Jaydon Schleifer", message: "Hey, what r u doing??", time: "09:00 AM", avatar: uri },
    //     { name: "Wilson Baptista", message: "Oh...thank you so much...", time: "07:46 AM", avatar: uri },
    //     { name: "Emery Septimus", message: "📷 Photo", time: "Yesterday", avatar: uri },
    // ];

    const [selected, setSelected] = useState(null);
    const [moreAnchorEl, setMoreAnchorEl] = useState(null);
    const [addAnchorEl, setAddAnchorEl] = useState(null);

    const [activeTab, setActiveTab] = useState("all");
    const navigation = useNavigate();

    const API = import.meta.env.VITE_BACKEND_URL;
    const { user, setReceiver, setReceiverDetails, onlineUsers } = useContext(AppContext)


    const handleMoreClick = (event) => setMoreAnchorEl(event.currentTarget);
    const handleAddClick = (event) => setAddAnchorEl(event.currentTarget);
    const handleCloseMore = () => setMoreAnchorEl(null);
    const handleCloseAdd = () => setAddAnchorEl(null);


    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.reload();

    }
    const handleProfile = () => {
        navigation("/profile")

    }
    const selectOption = async (id) => {
        setSelected(id);
        const token = localStorage.getItem("token");

        const selectedChatId = chats[id]._id;
        setChatId(selectedChatId)
        const chatUsers = chats[id].users;
        if (!chats["isGroupChat"]) {
            for (let i = 0; i < chatUsers.length; i++) {
                if (user.user._id !== chatUsers[i]._id) {
                    setReceiver(chatUsers[i]._id);
                    setReceiverDetails(chatUsers[i]);
                }
            }
        }


        try {
            const response = await axios.get(`${API}/message/${selectedChatId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Messages:", response.data);
            setMessages(response.data);
            setIsMessage(true);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    console.log(chats)


    const stories = ["Alfredo", "Ahmad", "Paityn", "Kaiya", "Zain"];

    return (
        <Container style={{ height: "99vh", width: "350px", paddingLeft: "10px" }} fluid className="chat-page border">
            <Row>
                <Col>
                    <div class="d-flex flex-row justify-content-between align-items-center pt-5">



                        <div class="d-flex flex-row justify-content-start">
                            <h5 className=" fw-bold text-dark"><img style={{ height: "50px", width: "50px", }} src={campusConnect} />Chat</h5>

                        </div>


                        <div class=" mb-2 d-flex flex-row justify-content-end" style={{ borderRadius: "50%", userSelect: "none" }}>
                            <div style={{ userSelect: "none" }}>
                                <Button aria-describedby="add-popover" onClick={handleAddClick}>
                                    <AddIcon />
                                </Button>

                                <Popover
                                    id="add-popover"
                                    open={Boolean(addAnchorEl)}
                                    anchorEl={addAnchorEl}
                                    onClose={handleCloseAdd}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                >
                                    <div style={{ userSelect: "none", padding: "10px" }}>
                                        <Link to="/createGroup" style={{ textDecoration: "none", color: "black", display: "block", marginBottom: "5px" }}>
                                            <Typography sx={{ p: 2 }}>
                                                Add Campus
                                            </Typography>
                                        </Link>
                                        <Link to="/createCommunity" style={{ textDecoration: "none", color: "black" }}>
                                            <Typography sx={{ p: 2 }}>
                                                Add Community
                                            </Typography>
                                        </Link>
                                    </div>
                                </Popover>

                            </div>
                            <div style={{ userSelect: "none" }}>
                                <Button aria-describedby="more-popover" onClick={handleMoreClick}>
                                    <MoreVertIcon />
                                </Button>

                                <Popover
                                    id="more-popover"
                                    open={Boolean(moreAnchorEl)}
                                    anchorEl={moreAnchorEl}
                                    onClose={handleCloseMore}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                >
                                    <Typography onClick={handleProfile} sx={{ p: 2 }}>Profile</Typography>
                                    <Typography onClick={handleLogout} sx={{ p: 2 }}>Logout</Typography>
                                </Popover>

                            </div>


                        </div>




                    </div>

                    <div className="position-relative w-100 mx-auto my-3" >
                        {/* Search Icon */}
                        <span
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "15px",
                                transform: "translateY(-50%)",
                                zIndex: "2",
                                color: "#888",
                            }}
                        >
                            <SearchIcon />
                        </span>

                        {/* Input Field */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            style={{
                                borderRadius: "50px",
                                paddingLeft: "45px",
                                color: "black" // enough padding to avoid overlapping with icon
                            }}
                        />
                    </div>



                    {/* Pinned Chats */}
                    {/* <div className="pinned-chats d-flex overflow-auto px-3 py-2">
                        {stories.map((name, i) => (
                            <div key={i} className="text-center me-3">
                                <div className="avatar-circle mx-auto position-relative">
                                    <div className="avatar-bg">🙂</div>
                                    <span className="status-dot bg-success" />
                                </div>
                                <small className="text-secondary">{name}</small>
                            </div>
                        ))}
                    </div> */}

                    {/* Tabs */}
                    <Nav variant="tabs" className="px-3  text-light rounded" defaultActiveKey="all" onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                        <Nav.Item>
                            <Nav.Link eventKey="all">All</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="users">All Users</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="groups">Community</Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                            <Nav.Link eventKey="contacts">Contacts</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="ms-auto">
                            <Nav.Link eventKey="archive">Archive</Nav.Link>
                        </Nav.Item> */}
                    </Nav>

                    {/* Chat List */}
                    {activeTab == "all" ? <ListGroup variant="flush" className="chat-list px-2">
                        {chats.map((chat, idx) => {
                            const receiver = !chat.isGroupChat
                                ? chat.users.find(use => use._id !== user.user._id)
                                : null;

                            return (
                                <ListGroup.Item
                                    id="chats"
                                    key={idx}
                                    style={{ userSelect: "none" }}
                                    className={`d-flex justify-content-between align-items-center py-3 border-bottom rounded ${selected === idx ? "chatSelected" : ""
                                        }`}
                                    onClick={() => selectOption(idx)}
                                >
                                    {chat.isGroupChat ? (
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
                                                        src={chat.groupProfile}
                                                        alt="Group"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="fw-semibold text-dark">{chat.name}</div>
                                                <small className="text-secondary">
                                                    {chat.lastMessage?.content?.slice(0, 20)}
                                                    {chat.lastMessage?.content?.length > 20 ? "..." : ""}
                                                </small>
                                            </div>
                                        </div>
                                    ) : (
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
                                                        src={receiver?.profile || GroupName}
                                                        alt="User"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="fw-semibold text-dark">{receiver?.userId}</div>
                                                <small className="text-secondary">
                                                    {chat.lastMessage?.content?.slice(0, 20)}
                                                    {chat.lastMessage?.content?.length > 20 ? "..." : ""}
                                                </small>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-end">
                                        <small className="text-muted d-block">{formatforChat(chat.updatedAt)}</small>
                                        {chat.lastMessage && <Badge bg="primary" pill>{chat.unread}</Badge>}
                                    </div>
                                </ListGroup.Item>
                            );
                        })}

                    </ListGroup> : activeTab == "users" ?
                        <ChatUser /> :

                        <ChatGroup />

                    }



                </Col>
            </Row>
        </Container>
    );
};

export default ChatUI;




