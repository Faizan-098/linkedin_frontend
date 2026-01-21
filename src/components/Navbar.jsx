import React, { useEffect, useRef, useState } from "react";
import dp from "../assets/profile.png";
import logo2 from "../assets/logo2.png";
import network from "../assets/network.svg";
import home from "../assets/home.svg";
import notification from "../assets/notification.svg";
import { Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/features/userSlice";
import { getProfileData } from "../redux/features/profile";
import { toast } from "react-toastify";

const Navbar = () => {
  // server-url
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // import selector & dispatch & navigate
  const { userData, notifications } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // for dynamic nav border-bottom
  const { pathname } = useLocation();

  // dropdown state
  const [showDropdown, setShowDropdown] = useState(false);

  // openSearch state
  const [openSearch, setOpenSearch] = useState(false);

  // search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearData] = useState([]);

  // Took reference
  const dropdownRef = useRef();
  const dropdownMenuRef = useRef();
  useEffect(() => {
    const hideDropdown = (e) => {
      if (
        dropdownMenuRef.current &&
        dropdownRef.current &&
        !dropdownMenuRef.current.contains(e.target) &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", hideDropdown);
    return () => {
      document.removeEventListener("click", hideDropdown);
    };
  }, []);

  // signout handler
  const handleSignOut = async () => {
    try {
      await axios.get(SERVER_URL + "/api/auth/logout", {
        withCredentials: true,
      });

       dispatch(setUserData(null));
      navigate("/login");
    } catch (error) {
      toast(error?.response?.data?.message || error.message);
    }
  };

  // search handler
  const searchHandler = async () => {
    try {
      const res = await axios.get(
        SERVER_URL + `/api/user/search?query=${searchQuery}`,
        { withCredentials: true },
      );
      console.log(res.data.users);
      setSearData(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log(searchQuery);

    if (searchQuery) {
      searchHandler();
    }
  }, [searchQuery]);

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-gray-200  py-2 sticky top-0 z-30">
      {/* navbar */}
      <div className="max-w-[1200px] px-2 m-auto flex justify-between">
        {/* logo & search */}
        <div className="flex gap-2 items-center w-full">
          <img
            onClick={() => {
              setOpenSearch(false);
              navigate("/");
            }}
            src={logo2}
            alt="logo"
            className="w-[41px] shrink-0 cursor-pointer"
          />

          {/* mobile search */}
          {!openSearch && (
            <Search
              onClick={() => setOpenSearch(true)}
              size={20}
              className="text-gray-700 flex sm:hidden cursor-pointer"
            />
          )}
          {openSearch && (
            <div className=" flex rounded-full ring ring-gray-400 py-1 px-3  items-center gap-2 max-w-[150px] w-full focus-within:ring-gray-700 hover:bg-gray-100  transition">
              <Search size={18} className="text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                className="outline-none flex-1"
                placeholder="search..."
              />
              {/* map searched users */}
              {searchData?.length > 0 && searchQuery && (
                <div className="flex flex-col max-h-[300px] overflow-y-auto  rounded-md p-2 absolute top-14 left-5 max-w-[300px] w-full ring ring-gray-300 bg-white">
                  {searchData?.length > 0 &&
                    searchData.map((user) => (
                      <div
                        key={user?._id}
                        onClick={() => {
                          dispatch(getProfileData(user?.userName));
                          setSearchQuery("");
                          setSearData([]);
                          navigate("/profile");
                        }}
                        className="flex items-center gap-2 border-b border-gray-200 p-2 cursor-pointer"
                      >
                        {/* profile image */}
                        <div className="rounded-full border-2 border-[#FFF] shrink-0 w-[45px] h-[45px] bg-gray-200 overflow-hidden cursor-pointer">
                          <img src={user?.profileImage || dp} alt="profile" />
                        </div>

                        {/* author-name */}
                        <div>
                          <h2 className="font-medium text-md">{`${user?.firstName} ${user?.lastName}`}</h2>
                          <p className="text-gray-700 text-sm">
                            {user?.headline}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* laptop-search */}
          <div className="relative  hidden sm:flex rounded-full ring ring-gray-400 py-1 px-3  items-center gap-2 max-w-[300px] w-full focus-within:ring-gray-700 hover:bg-gray-100  transition">
            <Search size={18} className="text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              className="outline-none flex-1"
              placeholder="search..."
            />

            {/* map searched users */}
            {searchData?.length > 0 && searchQuery && (
              <div className="flex flex-col gap-2 rounded-md p-2 absolute top-12 left-0 max-h-[300px] overflow-y-auto w-full ring ring-gray-300 bg-white">
                {searchData.length > 0 &&
                  searchData.map((user) => (
                    <div
                      key={user?._id}
                      onClick={() => {
                        dispatch(getProfileData(user?.userName));
                        setSearchQuery("");
                        setSearData([]);
                        navigate("/profile");
                      }}
                      className="flex items-center gap-2 border-b border-gray-200 p-2 cursor-pointer"
                    >
                      {/* profile image */}
                      <div className="rounded-full border-2 border-[#FFF] shrink-0 w-[50px] h-[50px] bg-gray-200 overflow-hidden cursor-pointer">
                        <img src={user?.profileImage || dp} alt="profile" />
                      </div>

                      {/* author-name */}
                      <div>
                        <h2 className="font-medium text-lg">{`${user?.firstName} ${user?.lastName}`}</h2>
                        <p className="text-gray-700 text-sm">
                          {user?.headline}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            
          </div>
        </div>

        {/* nav-link */}
        <div className="flex items-center text-gray-700">
          {/* link */}
          <Link
            to={"/"}
            className="md:flex hidden flex-col items-center justify-center text-[12px] cursor-pointer relative  px-4   "
          >
            <img src={home} className="w-[25px]" alt="network" />
            <p>Home</p>
            <div
              className={`absolute -bottom-1 w-full ${
                pathname === "/" && "h-[2px]"
              } bg-black `}
            ></div>
          </Link>
          {/* link */}
          <Link
            to={"/network"}
            className="flex flex-col items-center justify-center text-[12px] cursor-pointer relative   sm:px-4"
          >
            <img src={network} className="min-w-[25px]  " alt="network" />
            <p className="hidden sm:block">Network</p>
            <div
              className={`absolute -bottom-1 w-full ${
                pathname === "/network" && " sm:h-[2px]"
              } bg-black `}
            ></div>
          </Link>
          {/* link */}
          <Link to={"/notification"}>
            <div className="relative flex flex-col items-center justify-center text-[12px] cursor-pointer px-3 sm:px-4">
              <img src={notification} className="min-w-[23px] " alt="network" />
              {notifications?.length > 0 && (
                <div className="absolute -top-2 right-[6px] sm:-top-2 sm:right-7 rounded-full w-5 h-5 flex items-center justify-center bg-red-500 text-white font-medium">
                  {notifications.length}
                </div>
              )}
              <p className=" hidden sm:block">Notifications</p>
              <div
                className={`hidden sm:block absolute -bottom-1 w-full ${
                  pathname === "/notification" && "h-[2px]"
                } bg-black `}
              ></div>
            </div>
          </Link>

          {/* profile */}
          <div
            ref={dropdownMenuRef}
            className="rounded-full w-[45px] h-[45px] bg-gray-200  shrink-0   relative"
          >
            <img
              onClick={() => setShowDropdown((prev) => !prev)}
              src={userData?.profileImage || dp}
              className="w-full h-full cursor-pointer object-cover rounded-full w-[45px] h-[45px]"
              alt="profile"
            />
            {/* dropdown */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute w-[250px]   bg-[#FFF] top-[120%] -left-52 rounded-lg shadow-[0_0px_10px_rgb(0,0,0,0.1))]  border border-gray-300 p-3 flex flex-col items-center gap-3 "
              >
                <div className="rounded-full w-[65px] h-[65px] bg-gray-200 overflow-hidden cursor-pointer">
                  <img
                    src={userData?.profileImage || dp}
                    className="w-full h-full object-cover"
                    alt="profile"
                  />
                </div>
                <h2 className="font-medium text-xl">{`${userData?.firstName} ${userData?.lastName}`}</h2>
                <button
                  onClick={() => {
                    dispatch(getProfileData(userData?.userName));
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                  className="rounded-full transition duration-200 cursor-pointer  p-1 border hover:bg-[#0A66C2] hover:text-[#FFF] font-semibold text-sm  w-full text-[#0A66C2] "
                >
                  View Profile
                </button>
                <div className="w-full h-[1px] bg-gray-300"></div>
                <h2 className="font-medium text-lg w-full">
                  <div className="flex gap-2">
                    <img src={network} className="w-[23px]" alt="network" />
                    <p>My Networks {userData?.connections.length}</p>
                  </div>
                </h2>
                <button
                  onClick={handleSignOut}
                  className="rounded-full transition duration-200 cursor-pointer  p-1 border hover:bg-[#FFF] hover:text-[#0A66C2] font-semibold text-sm  w-full text-[#FFF] bg-[#0A66C2]"
                >
                  SignOut
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
