import React, { useEffect, useState } from "react";
import { getCurrentUserData, setEditState } from "../redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import { Camera, Pencil } from "lucide-react";
import dp from "../assets/profile.png";
import cover from "../assets/cover.png";
import EditProfile from "../components/EditProfile";
import DisplayPost from "../components/DisplayPost";
import { setPostModalState } from "../redux/features/postSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getProfileData } from "../redux/features/profile.js";
import CreatePost from "../components/CreatePost.jsx";

const Home = () => {
  // server-url
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // import selector & dispatch & navigate
  const { userData, editState } = useSelector((state) => state.user);
  const { userPosts, postModalState } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  suggested users state
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  // handle suggested users
  const handleSuggestedUsers = async () => {
    try {
      const res = await axios.get(SERVER_URL + "/api/user/getSuggestedUsers", {
        withCredentials: true,
      });
      setSuggestedUsers(res.data.suggestedUsers);
      console.log(res.data.suggestedUsers);
    } catch (error) {
      console.log("Error fetching suggested users:", error);
    }
  };
  // useEffect
  useEffect(() => {
    handleSuggestedUsers();
  }, []);
  return (
    <>
      <div className="min-h-[100vh] w-full  bg-[#F4F2EE] ">
        {editState && <EditProfile />}
        <Navbar />
        {/* main */}
        <div className="max-w-[1200px] m-auto flex flex-col md:flex-row gap-4 mt-[22px] px-2 ">
          {/* home-profile */}
          <div className="rounded-lg overflow-hidden h-fit bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)] flex-1 border border-gray-300">
            {/* thumbnail */}
            <div className="h-[100px] w-full  relative">
              <img
                className="h-full w-full object-cover  "
                src={userData.coverImage || cover}
                alt="thumbnail"
              />
              {/* camera */}
              <div
                onClick={() => dispatch(setEditState(true))}
                className=" cursor-pointer absolute top-3 right-3 hover:text-[#FFF] hover:bg-[#0A66C2] transition duration-200 text-[#0A66C2] p-1 rounded-full bg-gray-200 flex justify-center items-center"
              >
                <Camera size={20} />
              </div>
              {/* profile image */}
              <div
                onClick={() => {
                  dispatch(getProfileData(userData?.userName));
                  navigate("/profile");
                }}
                className="absolute top-[55%] left-[6%] rounded-full border-2 border-[#FFF] w-[70px] h-[70px] bg-gray-200 overflow-hidden cursor-pointer"
              >
                <img src={userData?.profileImage || dp} alt="profile" />
              </div>
            </div>
            {/* description */}
            <div className="p-3 mt-6 bg-[#FFF]">
              <h2 className="font-medium text-xl text-gray-800">{`${userData?.firstName} ${userData?.lastName}`}</h2>
              <p className="text-[12px] text-gray-700">
                {userData?.headline || ""}
              </p>
              <p className="text-[12px] text-gray-500 font-medium">
                {userData?.location || ""}
              </p>
              {/* edit */}
              <button
                onClick={() => dispatch(setEditState(true))}
                className="mt-3 flex gap-2 justify-center items-center rounded-full transition duration-200 cursor-pointer  p-1 border hover:bg-[#0A66C2] hover:text-[#FFF] font-semibold text-sm  w-full  text-[#0A66C2] bg-[#FFF]"
              >
                Edit Profile
                <Pencil size={18} />
              </button>
            </div>
          </div>

          {/* create-post-component */}
          {postModalState && <CreatePost />}
          {/* display-posts & create post btn */}
          <div className="flex flex-col gap-3 flex-2 justify-start">
            {/* create-post-btn */}
            <div className="rounded-lg  flex gap-2 items-center h-[100px] bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)] flex-2 border border-gray-300 p-3">
              {/* profile image */}
              <div className="rounded-full  border-2 border-[#FFF] shrink-0 w-[60px] h-[60px] bg-gray-200 overflow-hidden cursor-pointer">
                <img
                  onClick={() => {
                    dispatch(getProfileData(userData?.userName));
                    navigate("/profile");
                  }}
                  src={userData?.profileImage || dp}
                  alt="profile"
                />
              </div>

              {/* post-button */}
              <button
                onClick={() => dispatch(setPostModalState(true))}
                className="rounded-full border border-gray-400 px-4 py-2 md:py-3 text-left w-full text-gray-800 font-medium cursor-pointer hover:bg-gray-100 transition duration-200"
              >
                Start a post
              </button>
            </div>
            {/*display-posts  */}
            {userPosts?.length > 0 && (
              <div className="flex flex-col gap-3 pb-4">
                {userPosts.map((post) => {
                  const {
                    author,
                    description,
                    likes,
                    comment,
                    postImage,
                    _id,
                    createdAt,
                  } = post;

                  return (
                    <DisplayPost
                      key={_id}
                      author={author}
                      description={description}
                      likes={likes}
                      comment={comment}
                      postImage={postImage}
                      postId={_id}
                      createdAt={createdAt}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* suggested-users */}
          <div className="rounded-md h-fit max-h-[300px] overflow-y-auto hidden md:block bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)] flex-1 border border-gray-300 p-3">
            <h2 className="font-semibold text-lg mb-2 text-gray-800">
              Suggested Users
            </h2>
            {suggestedUsers?.length > 0 ? (
              <div className="flex flex-col gap-1">
                {/* map suggested users */}
                {suggestedUsers.map((user) => {
                  const { _id, firstName, lastName, userName, profileImage } =
                    user;
                  return (
                    <div
                      onClick={() => {
                        dispatch(getProfileData(userName));
                        navigate("/profile");
                      }}
                      key={_id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                    >
                      <div className="rounded-full border-2 border-[#FFF] w-[50px] h-[50px] bg-gray-200 overflow-hidden cursor-pointer">
                        <img src={profileImage || dp} alt="profile" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {firstName} {lastName}
                        </h3>
                        <p className="text-[12px] text-gray-500">{userName}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : ("Loading...")}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
