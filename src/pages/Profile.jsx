import React, { useEffect } from "react";
import { getCurrentUserData, setEditState } from "../redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import { Camera, Pencil } from "lucide-react";
import dp from "../assets/profile.png";
import cover from "../assets/cover.png";
import EditProfile from "../components/EditProfile";
import { useState } from "react";
import DisplayPost from "../components/DisplayPost.jsx";
import ConnectionButton from "../components/ConnectionButton.jsx";

const Profile = () => {
  const dispatch = useDispatch();

  // user and posts data
  const { profileData } = useSelector((state) => state.profile);
  const { userData, editState } = useSelector((state) => state.user);
  const { userPosts } = useSelector((state) => state.post);

  // userProfilePosts state
  const [userProfilePosts, setUserProfilePosts] = useState([]);
  useEffect(() => {
    setUserProfilePosts(
      userPosts.filter((post) => post?.author?._id === profileData?._id)
    );
  }, [profileData, userPosts]);
  return (
    <div className="min-h-[100vh] w-full bg-[#F4F2EE]">
      {/* navbar */}
      <Navbar />

      {/* update profile */}
      {editState && <EditProfile />}

      {/* profile content */}
      <div className="max-w-[900px] w-[95%] sm:w-[90%] mx-auto mt-8 pb-8 flex flex-col gap-3">
        {/* profile */}
        <div className="rounded-lg overflow-hidden h-fit bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)]  flex-1 border border-gray-300  overflow-hidden">
          {/* thumbnail */}
          <div className="h-[100px] md:h-[200px] w-full  relative">
            <img
              className="h-full w-full object-cover  "
              src={profileData?.coverImage || cover}
              alt="thumbnail"
            />

            {/* camera */}
          { profileData?._id === userData?._id && (  <div
          onClick={()=>dispatch(setEditState(true))}
              className=" cursor-pointer absolute top-3 right-3 hover:text-[#FFF] hover:bg-[#0A66C2] transition duration-200 text-[#0A66C2] p-1 rounded-full bg-gray-200 flex justify-center items-center"
            >
              <Camera size={20} />
            </div>)}

            {/* profile image */}
            <div
              className="absolute top-[65%] left-[6%] rounded-full border-2 border-[#FFF] h-[70px] w-[70px] md:w-[100px] md:h-[100px] bg-gray-200 overflow-hidden cursor-pointer"
            >
              <img src={profileData?.profileImage || dp} alt="profile" />
            </div>
          </div>
          {/* description */}
          <div className="p-3 mt-6 bg-[#FFF]">
            <h2 className="font-medium text-xl md:text-2xl text-gray-800">{`${profileData?.firstName} ${profileData?.lastName}`}</h2>
            <p className="text-[12px] md:text-[16px] text-gray-700">
              {profileData?.headline || ""}
            </p>
            <p className="text-[12px] md:text-[16px] text-gray-500 font-medium">
              {profileData?.location || ""}
            </p>
            <p className="text-[12px] md:text-[16px] text-gray-500 font-medium mb-2">
              {profileData?.connections?.length || 0} connections
            </p>
            {/* edit */}
            {profileData?._id === userData?._id ? (
              <button
                onClick={() => dispatch(setEditState(true))}
                className="mt-3 flex gap-2 justify-center items-center rounded-full transition duration-200 cursor-pointer  p-2 border hover:bg-[#0A66C2] hover:text-[#FFF] font-semibold text-sm md:text-md w-full  text-[#0A66C2] bg-[#FFF]"
              >
                Edit Profile
                <Pencil size={18} />
              </button>
            ) : (
              userData?._id !== profileData?._id && (
                <ConnectionButton authorId={profileData?._id} />
              )
            )}
          </div>
        </div>

        {/* experience */}
        {profileData && (
          <div className=" relative flex flex-col gap-2 rounded-md p-3 md:p-4 bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)]  flex-1 border border-gray-300  overflow-hidden ">
            {/* edit btn */}
            {profileData?._id === userData?._id && (
              <div className="absolute top-2 right-3 w-[35px] h-[35px]  rounded-full cursor-pointer flex justify-center items-center hover:text-[#FFF] hover:bg-[#0A66C2] transition duration-200 text-[#0A66C2] p-2 ">
                <Pencil onClick={() => dispatch(setEditState(true))} />
              </div>
            )}
            <h2 className="font-medium text-xl md:text-2xl text-gray-800">
              Experience
            </h2>
            {/* map-experience */}
            <div className="flex flex-col gap-3">
              {profileData?.experience &&
                profileData?.experience.map(
                  ({ _id, title, company, description }) => (
                    <div
                      key={_id}
                      className=" border-b-1 border-gray-400 p-2 flex flex-col gap-2 text-sm md:text-md"
                    >
                      <div className=" text-md md:text-[17px]  ">
                        <span className="font-medium ">Title:</span> {title}
                      </div>
                      <div className="text-md md:text-[17px]">
                        <span className="font-medium ">Company:</span> {company}
                      </div>
                      <div className="text-md md:text-[17px]">
                        <span className="font-medium ">Description:</span>{" "}
                        {description}
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        )}

        {/* skills */}
        {profileData && (
          <div className="relative flex flex-col gap-2 rounded-md p-3 md:p-4 bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)]  flex-1 border border-gray-300  overflow-hidden ">
            {/* edit btn */}
            {profileData._id === userData._id && (
              <div className="absolute top-2 right-3 w-[35px] h-[35px]  rounded-full cursor-pointer flex justify-center items-center hover:text-[#FFF] hover:bg-[#0A66C2] transition duration-200 text-[#0A66C2] p-2 ">
                <Pencil onClick={() => dispatch(setEditState(true))} />
              </div>
            )}
            <h2 className="font-medium text-xl md:text-2xl text-gray-800">
              Skills
            </h2>
            {/* map-skills */}
            <div className="flex gap-3 flex-wrap">
              {profileData.skills &&
                profileData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="rounded-full shadow-[0_0px_3px_rgb(0,0,0,0.1)]   border border-gray-300 flex-wrap w-fit px-2 py-1 flex items-center justify-center text-xs md:text-md"
                  >
                    {skill}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* education */}
        {profileData && (
          <div className="relative flex flex-col gap-2 rounded-md p-3 md:p-4 bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)]  flex-1 border border-gray-300  overflow-hidden ">
            {/* edit btn */}
            {profileData?._id === userData?._id && (
              <div className="absolute top-2 right-3 w-[35px] h-[35px]  rounded-full cursor-pointer flex justify-center items-center hover:text-[#FFF] hover:bg-[#0A66C2] transition duration-200 text-[#0A66C2] p-2 ">
                <Pencil onClick={() => dispatch(setEditState(true))} />
              </div>
            )}
            <h2 className="font-medium text-xl md:text-2xl text-gray-800">
              Education
            </h2>
            {/* map-education */}
            <div className="flex flex-col gap-3">
              {profileData?.education &&
                profileData?.education.map(
                  ({ _id, degree, collage, fieldOfStudy }) => (
                    <div
                      key={_id}
                      className=" border-b-1 border-gray-400   p-2 flex flex-col gap-2 text-sm md:text-md"
                    >
                      <div className=" text-md md:text-[17px]">
                        <span className="font-medium ">Degree: </span> {degree}
                      </div>
                      <div className=" text-md md:text-[17px]">
                        <span className="font-medium ">Collage: </span>{" "}
                        {collage}
                      </div>
                      <div className=" text-md md:text-[17px]">
                        <span className="font-medium ">Field of Study: </span>
                        {fieldOfStudy}
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        )}

        {/* map user posts */}
        <div className="rounded-md p-3 md:p-4 bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)]  flex-1 border border-gray-300  overflow-hidden ">
          <h2 className="font-medium text-xl md:text-2xl text-gray-800">
            Posts({userProfilePosts.length})
          </h2>
        </div>

        {/*map-posts  */}
        {userProfilePosts?.length > 0 && (
          <div className="flex flex-col gap-3 pb-4">
            {userProfilePosts.map((post) => {
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
    </div>
  );
};

export default Profile;
