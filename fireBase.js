import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyADg24EvzhMbf3WGDlO7wiOubTPNQIR25A",
    authDomain: "socialmedia-image.firebaseapp.com",
    projectId: "socialmedia-image",
    storageBucket: "socialmedia-image.appspot.com",
    messagingSenderId: "395498660914",
    appId: "1:395498660914:web:709f8662aac5aa2743482b",
    measurementId: "G-8MZHE7RYZL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
