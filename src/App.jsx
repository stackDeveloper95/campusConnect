import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import "./theme.scss"
import SignupForm from './components/signUpForm';
import PersonalInso from './components/PersonalInso';
import Grop from './chatCompoenents/Grop';
import Profile from './components/Profile';
import BasicModal from './components/image';
import CreateGroupForm from './components/createGroup';
import ImageUpload from './demo';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AppContext from './context/appContext';
import Profilefor from './components/profileForId';
import CreateCommunityForm from './components/createCommunity';




function App() {

  const { user } = useContext(AppContext);

  // const API = import.meta.env.VITE_BACKEND_URL;
  // const [user, setUser] = useState(null);
  // useEffect(() => {
  //   const fetchProtectedData = async () => {
  //     const token = localStorage.getItem("token");


  //     try {
  //       const res = await axios.get(`${API}/auth/protected`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       setUser(res.data)
  //       console.log(res.data)


  //     } catch (error) {
  //       console.error(error);

  //     }
  //   };

  //   fetchProtectedData();
  // }, []); // <-- run only on component mount
  console.log(user)


  return (
    <div style={{ backgroundColor: "#fce7dd" }}>


      <Router>
        {/* <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav> */}

        <Routes>
          <Route path="/" element={user ? <Grop /> : <Login />} />
          <Route path="/welcome" element={<PersonalInso />} />
          <Route path="/update" element={<PersonalInso />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignupForm />} />
          {/* <Route path="/chat" element={<Grop />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profilefor />} />
          <Route path="/createGroup" element={< CreateGroupForm />} />
          <Route path="/createCommunity" element={< CreateCommunityForm />} />



          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </Router>
    </div >
  );
}

export default App;
