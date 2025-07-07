import React, { useState } from "react";
import { storage } from "../fireBase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ImageUpload() {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!image) return alert("Please select an image first!");

        const imageRef = ref(storage, `images/${image.name}`);

        try {
            await uploadBytes(imageRef, image);
            const downloadURL = await getDownloadURL(imageRef);
            setUrl(downloadURL);
            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading image.");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload</button>
            {url && (
                <div>
                    <p>Image URL:</p>
                    <a href={url} target="_blank" rel="noreferrer">{url}</a>
                    <br />
                    <img src={url} alt="Uploaded" width={200} />
                </div>
            )}
        </div>
    );
}
