import axios from "axios";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const socket = io("http://localhost:8000");
const ConnectionButton = ({ authorId }) => {
  // server-url
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const navigate = useNavigate();
  // select state
  const { userData } = useSelector((state) => state.user);

  // status state
  const [status, setStatus] = useState("");

  // handle send connection
  const handleSendConnection = async () => {
    try {
      const res = await axios.post(
        SERVER_URL  + `/api/connection/send/${authorId}`,
        {},
        { withCredentials: true }
      );
      // console.log(res);
    } catch (error) {
      console.log(error.response.data.message || error.message);
    }
  };

  // handle get status
  const handleGetStatus = async () => {
    try {
      const res = await axios.get(
        SERVER_URL  + `/api/connection/getStatus/${authorId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data.status);
      setStatus(res.data.status);
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  };

  // handle remove connection
  const handleRemoveConnection = async () => {
    try {
      const res = await axios.delete(
        SERVER_URL  + `/api/connection/remove/${authorId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res);
    } catch (error) {
      console.log(error.response.data.message || error.message);
    }
  };
  // handle click
  const handleConnectionsApi = async () => {
    if (status == "disconnect") {
      await handleRemoveConnection();
    } else if (status == "received") {
      navigate("/network");
    } else {
      await handleSendConnection();
    }
  };

  useEffect(() => {
    socket.emit("register", userData?._id);

    if(userData ){
      // initial status
      handleGetStatus();
    } 

    socket.on("statusUpdate", ({ userId, newStatus }) => {
      // Update button if the current post belongs to other person
      if (userId === authorId) {
        // console.log("status=>", newStatus);
        setStatus(newStatus);
      }
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, [authorId, userData?._id]);

  return (
    <div>
      <button
        disabled={status == "pending"}
        onClick={handleConnectionsApi}
        className="px-4 w-fit text-md rounded-full transition duration-200 cursor-pointer  py-1 border bg-[#0A66C2] hover:bg-[#FFF] hover:text-[#0A66C2] text-[#FFF]  font-semibold     "
      >
        {status ? status : "Loading..."}
      </button>
    </div>
  );
};

export default ConnectionButton;
