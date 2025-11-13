// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserInput from "./pages/UserInput";
import UserHistory from "./pages/History";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <Router>
      <Navbar user={user} /> {/* NAV BAR WILL CHANGE BASED ON USER */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {user && (
          <>
            <Route path="/user-input" element={<UserInput />} />
            <Route path="/user-history" element={<History />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
