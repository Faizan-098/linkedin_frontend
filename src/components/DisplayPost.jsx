import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidLike } from "react-icons/bi";
import axios from "axios";
import moment from "moment";
import dp from "../assets/profile.png";
import { MessageCircleMore, SendHorizontal, ThumbsUp } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import ConnectionButton from "./ConnectionButton";
import { getProfileData } from "../redux/features/profile";
import { useNavigate } from "react-router-dom";
// server-url
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// create-sockiet-client
const sokiet = io(SERVER_URL);
const DisplayPost = ({
  postId,
  author,
  description,
  postImage,
  createdAt,
  likes,
  comment,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // dispatch hook
  const { userData } = useSelector((state) => state.user);
  // readmore state
  const [readMore, setReadMore] = useState(false);

  // ============== Like-Logic ==============//
  // likes state
  const [likesState, setLikesState] = useState(likes || []);

  // updatelikes
  const updateLikes = async (id) => {
    try {
      const res = await axios.get(SERVER_URL  + `/api/post/like/${id}`, {
        withCredentials: true,
      });
      // setLikesState(res.data.post.likes);
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
    }
  };

  // realtime like update with socket.io
  useEffect(() => {
    sokiet.on("likeUpdated", ({ postId: id, likes }) => {
      if (postId === id) {
        setLikesState(likes);
      }
    });
    return () => {
      sokiet.off("likeUpdated");
    };
  }, []);

  // ============== Comment-Logic ==============//

  // show comment section
  const [showComment, setShowComment] = useState(false);

  // send comment state
  const [commentsState, setcommentsState] = useState("");
  //  display comment state
  const [displayComments, setDisplayComments] = useState(comment || []);
  // updateComments
  const addComment = async (id) => {
    try {
      const res = await axios.post(
        SERVER_URL  + `/api/post/comment/${id}`,
        {
          content: commentsState,
        },
        {
          withCredentials: true,
        }
      );
      // console.log(res.data.post.comment);
      // setDisplayComments(res.data.post.comment);
      setcommentsState("");
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
    }
  };

  // realtime comment update with socket.io
  useEffect(() => {
    sokiet.on("commentAdded", ({ postId:id, comments }) => {
      if (postId === id) {
        setDisplayComments(comments);
      }
    });

    return () => {
      sokiet.off("commentAdded");
    };
  }, []);

  return (
    <div className="min-h-[300px] flex flex-col gap-3 rounded-lg p-3 bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)] border border-gray-300">
      <div className="flex gap-2 justify-between">
        {/* profile */}
        <div>
          {/* profile image */}
          <div
            onClick={() => {
              dispatch(getProfileData(author?.userName));
              navigate("/profile");
            }}
            className="rounded-full border-2 border-[#FFF] shrink-0 w-[60px] h-[60px] bg-gray-200 overflow-hidden cursor-pointer"
          >
            <img src={author?.profileImage || dp} alt="profile" />
          </div>

          {/* author-name */}
          <div>
            <h2 className="font-medium text-xl">{`${author?.firstName} ${author?.lastName}`}</h2>
            <p className="text-gray-700 text-md">{author?.headline}</p>
            <p>{moment(createdAt).fromNow()}</p>
          </div>
        </div>
        {/* connection */}
        {userData?._id !== author?._id && (
          <ConnectionButton authorId={author?._id} />
        )}
      </div>

      {/* description */}
      <div>
        <p
          className={`${
            readMore ? "h-auto" : "max-h-[75px] overflow-hidden"
          } text-gray-700`}
        >
          {description}
        </p>
        <button
          onClick={() => setReadMore((prev) => !prev)}
          className="border-none text-left cursor-pointer text-gray-500"
        >
          {readMore ? "less more" : "...read more"}
        </button>
      </div>

      {/* post-image*/}
      <div className="w-full max-[200px] rounded-lg  overflow-hidden">
        <img
          className="w-full h-full object-contain"
          src={postImage || cover}
          alt=""
        />
      </div>

      {/*display count likes and comments */}
      <div className="flex justify-between text-gray-700 ">
        <div className="flex gap-1 items-center">
          <ThumbsUp size={18} /> <span>{likesState?.length}</span>
        </div>
        <div
          onClick={() => setShowComment((prev) => !prev)}
          className="flex gap-1 items-center cursor-pointer"
        >
          {displayComments?.length} comments
        </div>
      </div>

      {/* horizontal-rule */}
      <div className="h-[2px] bg-gray-200"></div>

      {/* Like and comments */}
      <div className="flex gap-6 text-gray-700 ">
        {likesState?.includes(userData?._id) ? (
          <div className="flex gap-1 items-center cursor-pointer">
            <BiSolidLike
              className="cursor-pointer"
              size={18}
              onClick={() => updateLikes(postId)}
            />{" "}
            Liked
          </div>
        ) : (
          <div className="flex gap-1 items-center cursor-pointer">
            <ThumbsUp
              className="cursor-pointer"
              size={18}
              onClick={() => updateLikes(postId)}
            />{" "}
            Like
          </div>
        )}

        <div
          onClick={() => setShowComment((prev) => !prev)}
          className="flex gap-1 items-center cursor-pointer"
        >
          {" "}
          <MessageCircleMore size={18} /> comments
        </div>
      </div>
      {/* comment section */}
      {showComment && (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addComment(postId);
            }}
            className="flex items-center gap-1 rounded-full w-full border border-gray-300 px-3 py-2  focus:border-gray-700 transition duration-200"
          >
            <input
              value={commentsState}
              onChange={(e) => setcommentsState(e.target.value)}
              className="outline-none border-none w-full"
              type="text"
              placeholder="Add a comment..."
            />
            <button>
              <SendHorizontal
                size={20}
                className="text-gray-700 cursor-pointer hover:text-gray-900 transition duration-200"
              />
            </button>
          </form>

          {/* comment map */}
          <div className="flex flex-col gap-2 mt-3 max-h-[200px] overflow-y-auto">
            {displayComments?.length > 0 &&
              displayComments.map((c) => {
                return (
                  <div
                    key={c?._id}
                    className="flex flex-col gap-1 bg-gray-100 rounded-md p-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-1">
                        {/* profile image */}
                        <div className="rounded-full border-2 border-[#FFF] shrink-0 w-[45px] h-[45px] bg-gray-200 overflow-hidden cursor-pointer">
                          <img
                            src={c?.user?.profileImage || dp}
                            alt="profile"
                          />
                        </div>
                        {/* author-name */}
                        <div>
                          <h2 className="font-medium text-md">{`${c?.user?.firstName} ${c?.user?.lastName}`}</h2>
                          <p className="text-gray-700 text-sm">
                            {c?.user?.headline}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 ml-13 text-sm">{c?.content}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayPost;
