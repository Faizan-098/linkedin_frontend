import React from "react";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
import dp from "../assets/profile.png";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications, setNotifications } from "../redux/features/userSlice";
const Notification = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.user);


  //   handle like , comment and accept connection notification click
  const handleGetNotificationType = (type) => {
    if (type === "like") {
      return "Liked on your post.";
    } else if (type === "comment") {
      return "Commented on your post.";
    } else {
      return "Accepted your connection request.";
    }
  };

  //  handle delete notification
  const deleteNotification = async (id) => {
    try {
      const res = await axios.delete(
        SERVER_URL + `/api/notification/deleteOneNotification/${id}`,
        {
          withCredentials: true,
        },
      );
      console.log("notifcations => ", res);
      const filteredNotification = notifications.filter(
        (noti) => noti._id !== id,
      );
      dispatch(setNotifications(filteredNotification));
    } catch (error) {
      console.log("error => ", error);
    }
  };

  //  handle delete notification
  const clearNotifications = async (id) => {
    try {
      const res = await axios.delete(
        SERVER_URL + "/api/notification/deleteAllNotification",
        {
          withCredentials: true,
        },
      );
      console.log(" Clear Notifcations => ", res.data.message);
      dispatch(setNotifications([]));
    } catch (error) {
      console.log("error => ", error);
    }
  };

  // on component mount
  useEffect(() => {
    dispatch(getNotifications());
  }, []);

  return (
    <div className="min-h-screen  bg-[#FFF] ">
      {/* navbar */}
      <Navbar />

      {/* notification requests */}
      <div className="max-w-[1000px]  w-[90%] mx-auto mt-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-4">
            Notifications ({notifications?.length})
          </h2>

          {/* display when notification is exit */}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="bg-red-500 hover:bg-red-600 text-white font-medium md:text-lg rounded-sm py-1 px-3 h-fit cursor-pointer "
            >
              Clear All
            </button>
          )}
        </div>

        {/* display request list */}
        <div className="max-w-[1000px] max-h-[400px] overflow-y-auto w-full mx-auto mt-4 flex flex-col gap-4">
          {notifications?.length > 0 &&
            notifications.map((noti) => (
              <div
                key={noti?._id}
                className=" relative flex justify-between items-center p-3 md:p-4 border  border-gray-200 rounded-lg shadow-[0_0px_3px_rgb(0,0,0,0.1)]"
              >
                <div className="flex flex-col gap-2 ">
                  <div className="flex gap-2 md:items-center">
                    <div className="w-[45px] md:w-[50px] h-[45px]  md:h-[50px] rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={noti?.relatedUser?.profileImage || dp}
                        alt="profile"
                      />
                    </div>
                    <h3 className="md:text-xl font-semibold flex md:gap-2 flex-col md:flex-row ">
                      {`${noti?.relatedUser?.firstName} ${noti?.relatedUser?.lastName} `}
                      <p className="text-gray-600">
                        {handleGetNotificationType(noti?.type)}
                      </p>
                    </h3>
                  </div>

                  {noti.relatedPost && (
                    <div className="h-[80px] md:h-[100px]  w-[180px] md:w-[200px] rounded-md overflow-hidden">
                      <img
                        className="h-full w-full"
                        src={noti?.relatedPost?.postImage || dp}
                        alt=""
                      />
                    </div>
                  )}
                </div>
                <div
                  onClick={() => deleteNotification(noti?._id)}
                  className=" absolute right-1 top-1 sm:right-4 sm:top-4 cursor-pointer hover:bg-red-500 rounded-full hover:text-white transition-all md:p-1"
                >
                  <X />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
