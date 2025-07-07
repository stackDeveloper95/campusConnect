import React, { useState, useContext } from "react";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import forPoster from "../assets/forPoster.png";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CreateIcon from '@mui/icons-material/Create';
import AppContext from "../context/appContext"; // Adjust path if needed
import { useNavigate, useParams } from "react-router-dom";


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

const Profilefor = () => {
    const { user } = useContext(AppContext);
    const { id } = useParams()

    const [name, setName] = useState(user.name || "Unnamed");
    const [about, setAbout] = useState("Believe in yourself");
    const [editingName, setEditingName] = useState(false);
    const [editingAbout, setEditingAbout] = useState(false);
    const [open, setOpen] = useState(false);
    const navigation = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navi = () => {
        navigation("/")
    }


    console.log(user);

    return (
        <div className="container-fluid bg-transparent text-white min-vh-100 d-flex flex-row p-4 gap-4">
            {/* Profile Section */}
            <div className="bg-primary p-4 rounded shadow-lg w-100" style={{ maxWidth: "300px" }}>
                <h4 className="mb-4">
                    <span onClick={navi}><KeyboardBackspaceIcon /></span>Profile</h4>

                <div className="d-flex flex-column align-items-center">
                    {/* Profile Picture */}
                    <Button onClick={handleOpen}>
                        <img
                            src={user.profile || "https://i.imgur.com/fQn95U2.png"}
                            alt="Profile"
                            className="rounded-circle border border-2 border-light"
                            style={{ width: "130px", height: "130px", objectFit: "cover" }}
                        />
                    </Button>
                    <Modal open={open} onClose={handleClose}>
                        <Box sx={style} className="text-light rounded">
                            <img
                                src={user.profile || "https://i.imgur.com/fQn95U2.png"}
                                alt="Profile"
                                style={{ width: "300px", height: "300px", objectFit: "fill" }}
                            />
                            <div
                                style={{
                                    height: "40px",
                                    width: "40px",
                                    borderRadius: "50%",
                                    position: "relative",
                                    right: "-270px",
                                    top: "-25px"
                                }}
                                className="bg-primary shadow"
                            >
                                <div style={{ paddingTop: "7px", paddingLeft: "7px" }}>
                                    <CreateIcon />
                                </div>
                            </div>
                        </Box>
                    </Modal>

                    {/* Name */}
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
                                    <i
                                        className="bi bi-pencil-fill text-light"
                                        role="button"
                                        onClick={() => setEditingName(true)}
                                    ></i>
                                </>
                            )}
                        </div>
                        <p className="text-muted mt-1" style={{ fontSize: "0.85rem" }}>
                            This name will be visible to your contacts.
                        </p>
                    </div>

                    {/* About */}
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
                                    <i
                                        className="bi bi-pencil-fill text-light"
                                        role="button"
                                        onClick={() => setEditingAbout(true)}
                                    ></i>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Additional Details (Email, Campus, etc.) */}
                    <div className="mt-4 w-100 text-dark">
                        <small className="text-light">Email</small>
                        <p>{user.email || "Not provided"}</p>

                        <small className="text-light">Campus</small>
                        <p>{user.campus || "Not provided"}</p>

                        <small className="text-light">Department</small>
                        <p>{user.department || "Not provided"}</p>

                        <small className="text-light">GitHub</small>
                        <p>{user.gitHub || "Not provided"}</p>

                        <small className="text-light">LinkedIn</small>
                        <p>{user.LinkedIn || "Not provided"}</p>

                        <small className="text-light">LeetCode</small>
                        <p>{user.leetCode || "Not provided"}</p>

                        <small className="text-light">CodeForces</small>
                        <p>{user.codeForce || "Not provided"}</p>

                        <small className="text-light">Resume</small>
                        {user.resume ? (
                            <a href={user.resume} target="_blank" rel="noreferrer">View Resume</a>
                        ) : (
                            <p>Not uploaded</p>
                        )}

                        <small className="text-light">Projects</small>
                        <p>{user.project1 || "No project 1"}</p>
                        <p>{user.project2 || "No project 2"}</p>
                    </div>
                </div>
            </div>

            {/* Poster Section (UNCHANGED) */}
            <div
                className="d-flex flex-column align-items-center justify-content-center rounded w-100"
                style={{ backgroundColor: "transparent", maxWidth: "1150px" }}
            >
                <div className="w-100 d-flex justify-content-center">
                    <img
                        className="img-fluid"
                        src={forPoster}
                        alt="Poster"
                        style={{ maxWidth: "100%", height: "auto", maxHeight: "1000px" }}
                    />
                </div>

                <h4
                    className="text-dark text-center mt-3 px-3"
                    style={{ position: "relative", top: "-300px", left: "1px" }}
                >
                    Make Connection With Your Nearby Campus
                </h4>
            </div>
        </div>
    );
};

export default Profilefor;
