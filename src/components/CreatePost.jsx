import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/profile.png";
import cover from "../assets/cover.png"
import { Image, X } from "lucide-react";
import { setPostModalState, uploadUserPost } from "../redux/features/postSlice";
const CreatePost = () => {
    const {userData} = useSelector((state) => state.user);
    const {userPosts, isLoading } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    // file input ref
    const fileRef = useRef(null);


    // post state
    const [postState, setPostState] = useState({
        description: "",
        postImage: "",
        frontendPostImage: ""
    })

    // handle file image
    const handleFileImage = (e) => {
        const file = e.target.files[0];    
        if(file){
            setPostState({
                ...postState,
                postImage: file,   
                frontendPostImage: URL.createObjectURL(file)
            })
        }
    }

    // took reference of element
    const postModalRef = useRef(null);
    useEffect(()=>{
      const handleClickOutside = (event) => {
        if(postModalRef.current && !postModalRef.current.contains(event.target)){
            dispatch(setPostModalState(false));
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
    },[])

    // handle post submit
    const handlePostSubmit = async() => {
    
      // formData
    const formData = new FormData();
    formData.append("description", postState.description);
    if(postState.postImage) formData.append("postImage", postState.postImage);
    await dispatch(uploadUserPost(formData)).unwrap();
    dispatch(setPostModalState(false))
    setPostState({
        description: "",
        postImage: "",
        frontendPostImage: ""
    })
  }
   useEffect(()=>{
    console.log(userPosts);
    
    },[userPosts])
  return (
    <div 
    className="h-screen w-full px-5 fixed left-0 top-0 bg-gradient-to-b from-black/70 to-black/70 z-100 flex items-center justify-center">
      <div
      ref={postModalRef}
      className="flex flex-col gap-2 absolute max-w-[550px] w-[95%]   rounded-lg p-2 bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)] border border-gray-300  overflow-hidden">
        {/* cross */}
            <X 
            onClick={()=>dispatch(setPostModalState(false))}
            className="absolute top-[2%] right-[2%] text-gray-800 cursor-pointer" />
        <div className="flex items-center gap-2">
          {/* profile image */}
          <div className="rounded-full  border-2 border-[#FFF] shrink-0 w-[70px] h-[70px] bg-gray-200 overflow-hidden cursor-pointer">
            <img src={userData?.profileImage || dp} alt="profile" />
          </div>
          <h2 className="text-gray-800 font-semibold text-xl">{`${userData?.firstName} ${userData?.lastName}`}</h2>
        </div>

        {/* content */}
         <textarea
         placeholder="What do you want to talk about?"
        value={postState.description}
        onChange={(e) => setPostState({...postState, description: e.target.value})}
        className={` text-lg placeholder:text-xl w-full ${postState.frontendPostImage ? "h-[150px]":"h-[380px]"} p-2 resize-none outline-none " placeholder="What do you want to talk about?`}></textarea>
       {/* display-image */}
        {postState.frontendPostImage && <div className="flex justify-center h-[230px] overflow-hidden ">
            <img className=" h-full object-contain" src={postState.frontendPostImage} alt="" />
        </div>} 
        {/* upload-image */}
         <Image 
        onClick={()=> fileRef.current.click()}
        className="cursor-pointer text-gray-600 hover:text-gray-800  transition duration-200" size={30} />
        <input type="file" hidden ref={fileRef} onChange={handleFileImage}/>
        {/* horizontal-rule */}
         <div className="h-[2px] bg-gray-400"></div> 

        {/* post-button */}
        <button
              onClick={handlePostSubmit}

            className="mt-3 flex justify-center rounded-full transition duration-200 cursor-pointer  p-1 px-5 ml-auto border hover:bg-[#0c71d6] text-[#FFF] font-semibold text-lg  bg-[#0A66C2]"
          >
            {isLoading ? "Posting...":"Post"}
          </button>
      </div>
    </div>
  );
};

export default CreatePost;
