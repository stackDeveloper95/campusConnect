import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../../fireBase"

export default function ImageUploader() {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");

    const handleUpload = async () => {
        if (!image) return alert("Please select an image");

        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        setUrl(downloadURL);
        alert("Image uploaded!");
    };

    return (
        <div>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
            {url && <img src={url} alt="Uploaded" width="200" />}
        </div>
    );
}
