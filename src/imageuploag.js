import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../fireBase" // adjust the path as needed

export const uploadSingleImage = async (file, folder = "profile") => {
    try {
        if (!file) return null;

        const imageRef = ref(storage, `${folder}/${file.name}`);
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);

        return url;
    } catch (error) {
        console.error("Image upload error:", error);
        throw new Error("Failed to upload image.");
    }
};
