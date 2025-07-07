import React, { useState, useContext, useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import "./file.css"
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { storage } from "../../fireBase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AddIcon from '@mui/icons-material/Add';
import AppContext from '../context/appContext';

function PersonalInfo() {
    const [val, setVal] = useState(1);
    const [hover, setHover] = useState(false);
    const [open, setOpen] = useState(false);
    const API = import.meta.env.VITE_BACKEND_URL;
    const [message, setMessage] = useState("");
    const navigation = useNavigate()
    const { user } = useContext(AppContext);


    console.log(user)
    console.log("users Details")



    const [formData, setFormData] = useState({
        userId: '',
        college: '',
        department: '',
        profile: null,
        interest: '',
        linkedin: '',
        instagram: '',
        github: '',
        leetcode: '',
        codeforces: '',
        bestProject1: '',
        bestProject2: '',
        resume: null,
        certificates: []
    });

    useEffect(() => {
        if (user && user.user) {
            const timeoutId = setTimeout(() => {
                setFormData(prev => ({
                    ...prev,
                    userId: user.user.userId || '',
                    college: user.user.campus || '',
                    department: user.user.department || '',
                    profile: user.user.profile || null,
                    interest: user.user.domain || '',
                    linkedin: user.user.LinkedIn || '',
                    instagram: user.user.Instagram || '',
                    github: user.user.gitHub || '',
                    leetcode: user.user.leetCode || '',
                    codeforces: user.user.codeforces || '',
                    bestProject1: user.user.project1 || '',
                    bestProject2: user.user.project2 || '',
                    resume: user.user.resume || null,
                    certificates: user.user.certificates || []
                }));
            }, 1000); // 1 second delay

            return () => clearTimeout(timeoutId); // cleanup on unmount or change
        }
    }, [user]);


    const handleUpload = async () => {
        try {
            // Upload resume
            let resumeURL = '';
            if (formData.resume) {
                const resumeRef = ref(storage, `resumes/${formData.resume.name}`);
                await uploadBytes(resumeRef, formData.resume);
                resumeURL = await getDownloadURL(resumeRef);
            }
            let profileUrl = '';
            if (formData.profile) {
                const imageRef = ref(storage, `profile/${formData.profile.name}`);
                await uploadBytes(imageRef, formData.profile);
                profileUrl = await getDownloadURL(imageRef);
            }

            // Upload certificates
            let certificateURLs = [];
            if (formData.certificates.length > 0) {
                const uploadPromises = formData.certificates.map(async (file) => {
                    const certRef = ref(storage, `certificates/${file.name}`);
                    await uploadBytes(certRef, file);
                    return await getDownloadURL(certRef);
                });
                certificateURLs = await Promise.all(uploadPromises);
            }

            // Update formData with URLs
            console.log(profileUrl)
            setFormData((prevData) => ({
                ...prevData,
                resume: resumeURL,
                certificates: certificateURLs,
                profile: profileUrl    // ✅ ADD THIS LINE
            }));
            console.log(profileUrl)


            alert("Files uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading files.");
        }
    };



    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        const body = {
            userId: formData.userId,
            college: formData.college,
            department: formData.department,
            profile: formData.profile,
            interest: formData.interest,
            linkedin: formData.linkedin,
            instagram: formData.instagram,
            github: formData.github,
            leetcode: formData.leetcode,
            codeforces: formData.codeforces,
            bestProject1: formData.bestProject1,
            bestProject2: formData.bestProject2,
            resume: formData.resume,
            certificates: formData.certificates
        };

        try {
            const res = await axios.put(`${API}/auth/updateprofile`, body, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(res.data);
            // alert("Profile updated successfully!");
            setMessage("Profile updated successfully!")
            setOpen(true);

            navigation("/")
            // setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        }
    };


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(formData)
        setFormData({ ...formData, [name]: value });
    };


    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'resume') {
            setFormData({ ...formData, resume: files[0] });
        } else if (name === 'certificates') {
            setFormData({ ...formData, certificates: Array.from(files) });
        }
    };

    return (
        <div className='pt-5 row min-vh-100 min-vw-100 d-flex flex-row justify-content-between gap-4' style={{ background: "linear-gradient(135deg, #fce7dd, #f9d0ba)" }}>
            <div className='row'>
                <div className='col-10 pt-4'>
                    {val === 1 || val === 2 || val === 3 ? (
                        <div className='m-5'>
                            <div className="d-flex flex-start card p-4 bg-primary" style={{ borderRadius: "15px" }}>
                                <h2 className="text-white mb-4 pb-2">
                                    {val === 1 ? "User Details" : val === 2 ? "Links & Projects" : "Uploads"}
                                </h2>
                            </div>

                            <div className="d-flex align-items-center justify-content-center flex-grow-1">
                                <div
                                    className="card p-4"
                                    style={{
                                        position: "relative",
                                        top: "-30px",
                                        borderRadius: "15px",
                                        background: "linear-gradient(135deg, #fce7dd, #f9d0ba)"
                                    }}
                                >
                                    <div className='row'>
                                        {val === 1 && (
                                            <>
                                                <div className="col-12 col-md-6 col-lg-6 form-floating mb-3">
                                                    <input
                                                        type="text"
                                                        className="w-75 mx-5 form-control bg-transparent text-dark border-secondary"
                                                        id="userId"
                                                        placeholder="Username"
                                                        value={formData.userId}
                                                        name="userId"
                                                        readOnly
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="userId" className="text-muted mx-5 px-4">UserId</label>
                                                </div>

                                                <div className="form-floating mb-3 col-12 col-md-6 col-lg-6">
                                                    <input
                                                        type="text"
                                                        className="w-75 mx-5 form-control bg-transparent text-dark border-secondary"
                                                        id="college"
                                                        name="college"
                                                        placeholder="College Name"
                                                        value={formData.college}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="college" className="text-muted mx-5 px-4">Your Campus Name</label>
                                                </div>
                                                <div className="col-12 col-md-6 col-lg-6 form-floating mb-3">
                                                    <input
                                                        type="text"
                                                        className="w-75 mx-5 form-control bg-transparent text-dark border-secondary"
                                                        id="department"
                                                        name="department"
                                                        placeholder="Department"
                                                        value={formData.department}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="department" className="text-muted mx-5 px-4">Department</label>
                                                </div>

                                                <div className="col-12 col-md-6 col-lg-6 form-floating mb-3">
                                                    <input
                                                        type="text"
                                                        className="w-75 mx-5 form-control bg-transparent text-dark border-secondary"
                                                        id="interest"
                                                        name="interest"
                                                        placeholder="Interested Domain"
                                                        value={formData.interest}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="interest" className="text-muted mx-5 px-4">Interested Domain</label>
                                                </div>
                                            </>
                                        )}

                                        {val === 2 && (
                                            <>
                                                {[
                                                    { name: "linkedin", label: "LinkedIn Link" },
                                                    { name: "instagram", label: "Instagram Link" },
                                                    { name: "github", label: "GitHub Link" },
                                                    { name: "leetcode", label: "LeetCode Link" },
                                                    { name: "codeforces", label: "Codeforces Link" },
                                                    { name: "bestProject1", label: "Best Project 1" },
                                                    { name: "bestProject2", label: "Best Project 2" }
                                                ].map((field, index) => (
                                                    <div className="col-12 col-md-6 col-lg-6 form-floating mb-3" key={index}>
                                                        <input
                                                            type="url"
                                                            className="w-75 mx-5 form-control bg-transparent text-dark border-secondary"
                                                            id={field.name}
                                                            name={field.name}
                                                            placeholder={field.label}
                                                            value={formData[field.name]}
                                                            onChange={handleChange}
                                                        />
                                                        <label htmlFor={field.name} className="text-muted mx-5 px-4">{field.label}</label>
                                                    </div>
                                                ))}
                                            </>
                                        )}

                                        {val === 3 && (
                                            <>

                                                {/* upload profile */}
                                                <div className="col-12 col-md-6 col-lg-6 mb-3 px-5">
                                                    <div style={{ position: "relative", display: "inline-block" }}>
                                                        <img
                                                            style={{
                                                                height: "200px",
                                                                width: "200px",
                                                                borderRadius: "50%",
                                                                objectFit: "cover",
                                                                border: "2px solid #ccc"
                                                            }}
                                                            src={
                                                                !formData.profile
                                                                    ? "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg"
                                                                    : typeof formData.profile === "string"
                                                                        ? formData.profile
                                                                        : URL.createObjectURL(formData.profile)
                                                            }
                                                            alt="Profile"
                                                        />

                                                        <label htmlFor="profile" style={{
                                                            position: "absolute",
                                                            bottom: "0",
                                                            right: "4px",
                                                            backgroundColor: "#0d6efd",
                                                            borderRadius: "50%",
                                                            padding: "6px",
                                                            cursor: "pointer",
                                                            color: "white",
                                                            boxShadow: "0 0 4px rgba(0,0,0,0.3)"
                                                        }}>
                                                            <AddIcon />
                                                        </label>

                                                        <input
                                                            className="form-control d-none"
                                                            id="profile"
                                                            type="file"
                                                            name="profile"
                                                            accept="image/*"
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, profile: e.target.files[0] })
                                                            }
                                                        />
                                                    </div>
                                                    {/* <label htmlFor="profile" className="form-label text-dark mt-2 d-block">Upload Profile Image:</label> */}
                                                </div>


                                                <div id="file" className='row'>
                                                    <div className="col-12 col-md-6 col-lg-6 mb-3 px-5">
                                                        <label className="form-label text-dark">Upload Resume:</label>
                                                        <input
                                                            className="form-control"
                                                            type="file"
                                                            name="resume"
                                                            onChange={handleFileChange}
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-6 col-lg-6 mb-3 px-5">
                                                        <label className="form-label text-dark">Upload Certificates:</label>
                                                        <input
                                                            className="form-control"
                                                            type="file"
                                                            name="certificates"
                                                            multiple
                                                            onChange={handleFileChange}
                                                        />
                                                    </div>
                                                    <div className='d-flex justify-content-center items-center'>
                                                        <button
                                                            className='d-flex btn btn-outline-primary mt-3 ms-3 w-25 justify-content-center items-center'
                                                            onClick={handleUpload}
                                                        >
                                                            <FileUploadIcon /> Upload Files
                                                        </button>
                                                    </div>

                                                </div>


                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Navigation Buttons */}
                    <div className='d-flex flex-row justify-content-between align-items-center gap-4'>
                        <div className='fs-5 mt-3 text-primary m-3'>
                            {val > 1 && (
                                <button
                                    style={{ color: hover ? 'white' : 'inherit' }}
                                    className='btn btn-outline-primary  px-4 py-2 fw-semibold'
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                    onClick={() => setVal(val - 1)}
                                >
                                    <ArrowBackIosIcon /> Previous
                                </button>
                            )}
                        </div>

                        <div>
                            {val === 3 ? (
                                <button
                                    className='fs-5 mt-3 text-light btn btn-primary shadow-sm d-flex justify-content-center align-items-center gap-2 m-3'
                                    onClick={handleSubmit} // call your update function
                                >
                                    Update Profile <NavigateNextIcon />
                                </button>
                            ) : (
                                <button
                                    className='fs-5 mt-3 text-light btn btn-primary shadow-sm d-flex justify-content-center align-items-center gap-2 m-3'
                                    onClick={() => setVal(val + 1)}
                                >
                                    Next <NavigateNextIcon />
                                </button>
                            )}
                        </div>

                    </div>
                </div>

                <div className='h-100 col-1 mt-3' style={{ borderLeft: '1px solid' }}></div>

                {/* Step Indicator Buttons */}
                <div className='col-1 pt-5 d-flex flex-column gap-2'>
                    {[1, 2, 3].map((num) => (
                        <button
                            key={num}
                            style={{
                                borderRadius: '50%',
                                height: '40px',
                                width: '40px',
                                color: num <= val ? 'white' : '#cd6731',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                transition: '0.4s',
                                userSelect: 'none'
                            }}
                            className={`btn ${num <= val ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => { setVal(num) }}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                <div style={{ maxWidth: "500px" }}>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert
                            onClose={handleClose}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {message}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        </div>

    );
}

export default PersonalInfo;
