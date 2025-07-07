import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { uploadSingleImage } from "../imageuploag";
import AppContext from "../context/appContext";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AddIcon from '@mui/icons-material/Add';
import "./LoginForm.css";

export default function CreateGroupForm() {
    const [groupName, setGroupName] = useState("");
    const [motto, setMotto] = useState("");
    const [groupType, setGroupType] = useState("public");
    const [membersCanAdd, setMembersCanAdd] = useState(false);
    const [image, setImage] = useState(null);
    const [uploadUrl, setUploadUrl] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`${API}/auth/all`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                setAllUsers(res.data);
                setSearchUsers(res.data);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };
        fetchUsers();
    }, []);

    const options = allUsers.map(user => ({
        value: user._id,
        label: `${user.userId} (${user.campus})`,
        customLabel: (
            <div className="d-flex align-items-center gap-2">
                <img
                    src="https://i.imgur.com/fQn95U2.png"
                    alt=""
                    style={{ width: 25, height: 25, borderRadius: "50%" }}
                />
                <span>{user.userId}</span>
                <span className="text-muted ms-2">({user.campus})</span>
            </div>
        )
    }));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");
        let finalDp = "";

        if (image) {
            try {
                const url = await uploadSingleImage(image, "profile");
                finalDp = url;
                setUploadUrl(url);
            } catch {
                alert("Image upload failed.");
                setLoading(false);
                return;
            }
        }

        const payload = {
            name: groupName,
            groupMotto: motto,
            isPublic: groupType,
            groupAdmin: user.user._id,
            users: selectedUsers,
            groupProfile: finalDp,
        };

        try {
            await axios.post(`${API}/chat/group`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Group created!");
            navigate("/");
        } catch (err) {
            console.error("Error creating group:", err);
            alert("Error creating group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5" style={{ marginLeft: "150px", width: "100vw" }}>
            <div className="mb-4">
                <button onClick={() => navigate("/")} className="btn btn-link text-dark text-decoration-none">
                    <KeyboardBackspaceIcon /> Back to Home
                </button>
            </div>

            <div className="bg-light mx-auto bg-white shadow rounded p-4" style={{ maxWidth: "700px" }}>
                <h2 className="fw-bold mb-2">Create New Group</h2>
                <p className="text-muted mb-4">Build your community and start connecting</p>

                {/* Group Image Upload */}
                <div className="d-flex flex-column align-items-center mb-4">
                    <div style={{ position: "relative" }}>
                        <img
                            src={image ? URL.createObjectURL(image) : "https://i.imgur.com/fQn95U2.png"}
                            alt="preview"
                            style={{
                                width: "120px",
                                height: "120px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                boxShadow: "0 0 20px rgba(0,0,0,0.1)"
                            }}
                        />
                        <label htmlFor="image-upload" className="image-upload-icon">
                            <AddIcon style={{ color: "white", fontSize: "20px" }} />
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="d-none"
                            onChange={handleImageChange}
                        />
                    </div>
                    <small className="text-muted mt-2">Upload a group photo to make it more recognizable</small>
                </div>

                {/* Group Details */}
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control bg-transparent border border-dark text-dark"
                        id="groupName"
                        placeholder="Group Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                    <label htmlFor="groupName" className="text-dark">Group Name *</label>
                </div>

                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control bg-transparent border border-dark"
                        id="groupMotto"
                        placeholder="Group Motto"
                        value={motto}
                        onChange={(e) => setMotto(e.target.value)}
                    />
                    <label htmlFor="groupMotto " className="text-dark">Group Motto</label>
                </div>

                {/* Group Privacy */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Group Privacy</label>
                    <div className="d-flex gap-3 mt-1">
                        <div className="form-check">
                            <input className="form-check-input bg-transparent" type="radio" id="public" name="groupType" value="public" checked={groupType === "public"} onChange={() => setGroupType("public")} />
                            <label className="form-check-label" htmlFor="public">Public</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="private" name="groupType" value="private" checked={groupType === "private"} onChange={() => setGroupType("private")} />
                            <label className="form-check-label" htmlFor="private">Private</label>
                        </div>
                    </div>
                    <div className="form-check mt-2">
                        <input className="form-check-input" type="checkbox" id="membersCanAdd" checked={membersCanAdd} onChange={(e) => setMembersCanAdd(e.target.checked)} />
                        <label className="form-check-label" htmlFor="membersCanAdd">
                            Allow members to invite others
                        </label>
                    </div>
                </div>

                {/* Member Selection */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">Add Members</label>
                    <Select
                        options={options}
                        isMulti
                        onChange={(selectedOptions) => setSelectedUsers(selectedOptions.map(opt => opt.value))}
                        getOptionLabel={(e) => e.customLabel}
                        getOptionValue={(e) => e.value}
                        placeholder="Search by username or campus..."
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>

                <button className="btn btn-primary w-100" type="submit" onClick={handleSubmit}>
                    {loading ? "Creating..." : "Create Group"}
                </button>
            </div>
        </div>
    );
}