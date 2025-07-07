import React, { useState, useEffect, useContext } from "react";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import forPoster from "../assets/forPoster.png";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CreateIcon from '@mui/icons-material/Create';
import AppContext from "../context/appContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'black',
    border: "none",
    boxShadow: 24,
    p: 4,
    opacity: "0.7",
    maxWidth: "600px"
};

const Profile = () => {
    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_BACKEND_URL;

    const [name, setName] = useState("Unnamed");
    const [about, setAbout] = useState("Believe in yourself");
    const [editingName, setEditingName] = useState(false);
    const [editingAbout, setEditingAbout] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const goBack = () => navigate("/");
    const goEdit = () => navigate("/welcome");

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
                setUser(res.data);
                setName(res.data?.user?.name || "Unnamed");
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchProtectedData();
    }, []);

    if (!user || !user.user) {
        return <div className="text-white p-4">Loading profile...</div>;
    }

    return (
        <div className="container-fluid bg-transparent text-white min-vh-100 d-flex flex-row p-4 gap-4">
            <div className="bg-primary p-4 rounded shadow-lg w-100" style={{ maxWidth: "300px" }}>
                <h4 className="mb-4">
                    <span onClick={goBack}><KeyboardBackspaceIcon /></span> Profile
                </h4>

                <div className="d-flex flex-column align-items-center">
                    <Button onClick={handleOpen}>
                        <img
                            src={user?.user?.profile || "https://i.imgur.com/fQn95U2.png"}
                            alt="Profile"
                            className="rounded-circle border border-2 border-light"
                            style={{ width: "130px", height: "130px", objectFit: "cover" }}
                        />
                    </Button>

                    <div onClick={goEdit} style={{ paddingTop: "7px", paddingLeft: "150px" }}>
                        <CreateIcon />
                    </div>

                    <Modal open={open} onClose={handleClose}>
                        <Box sx={style} className="text-light rounded">
                            <img
                                src={user?.user?.profile || "https://i.imgur.com/fQn95U2.png"}
                                alt="Profile"
                                style={{ width: "300px", height: "300px", objectFit: "fill" }}
                            />
                            <div style={{ height: "40px", width: "40px", borderRadius: "50%", position: "relative", right: "-270px", top: "-25px" }} className="bg-primary shadow">
                                <div style={{ paddingTop: "7px", paddingLeft: "7px" }}>
                                    <CreateIcon />
                                </div>
                            </div>
                        </Box>
                    </Modal>

                    {/* Name Editing */}
                    <div className="mt-4 w-100">
                        <small className="text-light">Your name</small>
                        <div className="d-flex justify-content-between align-items-center mt-1 text-dark">
                            {editingName ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={() => setEditingName(false)}
                                    autoFocus
                                    className="form-control bg-dark text-white border-light"
                                />
                            ) : (
                                <>
                                    <p className="mb-0 h5">{name}</p>
                                    <i className="bi bi-pencil-fill text-light" role="button" onClick={() => setEditingName(true)}></i>
                                </>
                            )}
                        </div>
                        <p className="text-muted mt-1" style={{ fontSize: "0.85rem" }}>
                            This name will be visible to your contacts.
                        </p>
                    </div>

                    {/* About Editing */}
                    <div className="mt-4 w-100">
                        <small className="text-light">About</small>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                            {editingAbout ? (
                                <input
                                    type="text"
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    onBlur={() => setEditingAbout(false)}
                                    autoFocus
                                    className="form-control bg-dark text-white border-light"
                                />
                            ) : (
                                <>
                                    <p className="mb-0 h5 text-dark">{about}</p>
                                    <i className="bi bi-pencil-fill text-light" role="button" onClick={() => setEditingAbout(true)}></i>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="mt-4 w-100 text-dark">
                        {[
                            { label: "Email", value: user.user.email },
                            { label: "User ID", value: user.user.userId },
                            { label: "Campus", value: user.user.campus },
                            { label: "Department", value: user.user.department },
                            { label: "Domain", value: user.user.domain },
                        ].map((item, idx) => (
                            <React.Fragment key={idx}>
                                <small className="text-light">{item.label}</small>
                                <p>{item.value || "Not provided"}</p>
                            </React.Fragment>
                        ))}

                        {/* Social Links */}
                        {[
                            { label: "GitHub", value: user.user.gitHub },
                            { label: "LinkedIn", value: user.user.LinkedIn },
                            { label: "Instagram", value: user.user.Instagram },
                            { label: "LeetCode", value: user.user.leetCode },
                            { label: "CodeForces", value: user.user.codeForce }
                        ].map((item, idx) => (
                            <React.Fragment key={idx}>
                                <small className="text-light">{item.label}</small>
                                <p>
                                    {item.value ? (
                                        <a href={item.value} target="_blank" rel="noreferrer" className="text-white text-decoration-underline">
                                            {item.value}
                                        </a>
                                    ) : (
                                        "Not provided"
                                    )}
                                </p>
                            </React.Fragment>
                        ))}

                        {/* Resume */}
                        <small className="text-light">Resume</small>
                        {user.user.resume ? (
                            <>
                                <a href={user.user.resume} target="_blank" rel="noreferrer" className="text-white text-decoration-underline">View Resume</a>
                                <div className="mt-2">
                                    <img src={user.user.resume} alt="Resume" style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }} />
                                </div>
                            </>
                        ) : (
                            <p>Not uploaded</p>
                        )}

                        {/* Certificates */}
                        <small className="text-light">Certificates</small>
                        {user.user.certificates?.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                                {user.user.certificates.map((cert, idx) => (
                                    <a key={idx} href={cert} target="_blank" rel="noreferrer">
                                        <img
                                            src={cert}
                                            alt={`Certificate ${idx + 1}`}
                                            style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p>No certificates uploaded</p>
                        )}

                        {/* Projects */}
                        <small className="text-light">Projects</small>
                        <p>{user.user.project1 || "No project 1"}</p>
                        <p>{user.user.project2 || "No project 2"}</p>
                    </div>
                </div>
            </div>

            {/* Poster Section */}
            <div className="d-flex flex-column align-items-center justify-content-center rounded w-100" style={{ backgroundColor: "transparent", maxWidth: "1150px" }}>
                <div className="w-100 d-flex justify-content-center">
                    <img
                        className="img-fluid"
                        src={forPoster}
                        alt="Poster"
                        style={{ maxWidth: "100%", height: "auto", maxHeight: "1000px" }}
                    />
                </div>
                <h4 className="text-dark text-center mt-3 px-3" style={{ position: "relative", top: "-300px", left: "1px" }}>
                    Make Connection With Your Nearby Campus
                </h4>

            </div>
        </div>
    );
};

export default Profile;
