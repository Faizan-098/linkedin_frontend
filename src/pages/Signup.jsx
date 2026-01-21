import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setError, setIsLoading } from "../redux/features/authSlice";
import { toast } from "react-toastify";
import { setUserData } from "../redux/features/userSlice";
const Signup = () => {
  // server-url
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // dispatch
  const dispatch = useDispatch();
  // navigate
  const navigate = useNavigate();

  // hide/show password state
  const [showPasword, setShowPasword] = useState(false);

  // auth state
  const { isLoading, error } = useSelector((state) => state.auth);

  // signup state
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  // ochange (input handler)
  const onChangeHandler = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // onsubmit (form handler)
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    dispatch(setIsLoading(true));
    try {
      const res = await axios.post(
        SERVER_URL + "/api/auth/signup",
        signupData,
        {
          withCredentials: true,
        }
      );

      // set-user-data
      dispatch(setUserData(res.data.user));

      dispatch(setIsLoading(false));

      dispatch(setError(""));

      await toast("Account created successfully!").unwrap();

      setSignupData({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
      });

      // return to home
      navigate("/");
    } catch (error) {
      dispatch(setIsLoading(false));
      dispatch(setError(error?.response?.data?.message || "Signup failed"));
    }
  };

  return (
    <div className="w-full h-screen bg-[#FFFFFF] flex flex-col gap-5  items-center sm:py-8 p-4 sm:px-10">
      {/* Logo */}
      <div className="w-full">
        <img src={logo} className="min-w-[120px]  " alt="linkedLogo" />
      </div>
      {/* form */}
      <div className="sm:rounded-lg w-full shadow-[0_0px_10px_rgb(0,0,0,0.1))]  sm:border sm:border-gray-200 max-w-[420px] p-5 py-6 flex flex-col items-center gap-3">
        <h1 className="text-[#0A66C2] text-4xl font-bold mb-2">Sign Up</h1>
        {error && (
          <p className="text-red-500 text-md font-medium text-center">
            *{error}
          </p>
        )}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-4 items-center w-full transition duration-200 "
        >
          <input
            name="firstName"
            value={signupData.firstName}
            onChange={onChangeHandler}
            className="w-full border border-gray-200 rounded-md p-3 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
            type="text"
            placeholder="Firstname"
          />
          <input
            name="lastName"
            value={signupData.lastName}
            onChange={onChangeHandler}
            className="w-full border border-gray-200 rounded-md p-3 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
            type="text"
            placeholder="Lastname"
          />
          <input
            name="userName"
            value={signupData.userName}
            onChange={onChangeHandler}
            className="w-full border border-gray-200 rounded-md p-3 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
            type="text"
            placeholder="Username"
          />
          <input
            name="email"
            value={signupData.email}
            onChange={onChangeHandler}
            className="w-full border border-gray-200 rounded-md p-3 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
            type="email"
            placeholder="Email"
          />
          {/* password */}
          <div className="w-full flex items-center gap-2  border border-gray-200 rounded-md p-3  focus-within:shadow-[0_0px_4px_rgb(10,102,194))] focus-within:ring-1 focus-within:ring-[rgb(10,102,194)] duration-200 ">
            <input
              name="password"
              value={signupData.password}
              onChange={onChangeHandler}
              className="w-full  outline-none border-none"
              type={showPasword ? "text" : "password"}
              placeholder="Password"
            />
            <span
              className="text-[#0A66C2] cursor-pointer font-medium"
              onClick={() => setShowPasword(!showPasword)}
            >
              {showPasword ? "hide" : "show"}
            </span>
          </div>
          <button
            disabled={isLoading}
            className="rounded-full bg-[#0A66C2] text-[#FFFFFF] font-semibold w-full py-3 hover:bg-[#0d76df]  cursor-pointer"
          >
            {isLoading ? "loading..." : "sign up"}
          </button>
          <p
            onClick={() => navigate("/login")}
            className="flex gap-2 text-gray-700 cursor-pointer"
          >
            Already have an account ?{" "}
            <span className="text-[#0A66C2]">Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
