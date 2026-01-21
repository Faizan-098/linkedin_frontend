import Home from "./pages/Home";
import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserData, getNotifications } from "./redux/features/userSlice.js";
import { getAllPosts } from "./redux/features/postSlice.js";
import Network from "./pages/Network";
import Profile from "./pages/Profile.jsx";
import Notification from "./pages/Notification.jsx";
const App = () => {
  // import dispatch  & selector
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { userPosts } = useSelector((state) => state.post);

  // when home component mount
  useEffect(() => {
    dispatch(getCurrentUserData());
  }, []);

  //whenever userData state update call getAllPosts
  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getNotifications())
  }, [userData]);


  // test on client
  useEffect(() => {
    console.log("UserProfile=>", userData);
    console.log("userPosts=>", userPosts);
  }, [userData, userPosts]);

  return (
    <>
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/network"
          element={userData ? <Network /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={userData ? <Navigate to={"/"} /> : <Signup />}
        />
        <Route
          path="/login"
          element={userData ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/notification"
          element={userData ? <Notification /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </>
  );
};

export default App;
