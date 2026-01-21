import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import dp from "../assets/profile.png";
const Network = () => {
  // server-url
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [networkRequests, setNetworkRequests] = useState([]);
  // handle get connections
  const handleGetConnectionsRequests = async () => {
    try {
      const res = await axios.get(SERVER_URL  + "/api/connection/requests", {
        withCredentials: true,
      });
      setNetworkRequests(res.data.requests);
    } catch (error) {
      console.log(error.response.data.message || error.message);
    }
  };

  // handle accept connection request
  const handleAcceptConnectionRequest = async (reqestId) => {
    try {
      const res = await axios.put(
        SERVER_URL  + `/api/connection/accept/${reqestId}`,
        {},
        {
          withCredentials: true,
        }
      );
      // console.log(res.data.message);
      //filter request from network array
      setNetworkRequests(
        networkRequests.filter((request) => request._id !== reqestId)
      );
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  // handle reject connection request
  const handleRejectConnectionRequest = async (reqestId) => {
    try {
      const res = await axios.put(
        SERVER_URL  + `/api/connection/reject/${reqestId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(res.data.message);
      //filter request from network array
      setNetworkRequests(
        networkRequests.filter((request) => request._id !== reqestId)
      );
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    handleGetConnectionsRequests();
  }, []);
  return (
    <div className="min-h-screen  bg-[#FFF] ">
      <Navbar />
      {/* network requests */}
      <div className="max-w-[1000px]  w-[90%] mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Invitations Requests {networkRequests.length}{" "}
        </h2>
      </div>
      {/* display request list */}
      <div className="max-w-[1000px]  w-[90%] max-h-[400px] overflow-y-auto mx-auto mt-4 flex flex-col gap-4">
        {networkRequests.length > 0 &&
          networkRequests.map((request) => (
            <div
              key={request?._id}
              className="flex flex-col w-full sm:flex-row gap-3 justify-between sm:items-center p-4  border  border-gray-200 rounded-lg shadow-[0_0px_3px_rgb(0,0,0,0.1)]"
            >
              <div className="flex items-center gap-4">
                <div className="w-[60px] h-[60px] rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={request?.sender?.profileImage || dp}
                    alt="profile"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{`${request?.sender?.firstName} ${request?.sender?.lastName}`}</h3>
                  <p className="text-gray-600">{request?.sender?.headline}</p>
                </div>
              </div>

              <div className="flex gap-2  ms-auto">
                <button
                  onClick={() => handleAcceptConnectionRequest(request?._id)}
                  className="px-4 py-2 cursor-pointer bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white rounded-lg"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectConnectionRequest(request?._id)}
                  className="px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-500/90 text-white rounded-lg"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Network;
