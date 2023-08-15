import React, { useEffect, useState } from "react";
import { chatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../Utils/ChatLogics";
import Modal from "./Miscellaneous/Modal";
import UpdateGroupChatModel from "./Miscellaneous/UpdateGroupChatModel";
import { fetchMessageApi, sendMessageApi } from "../Utils/Api";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import { ColorRing, ThreeDots } from "react-loader-spinner";

// const ENDPOINT = "http://localhost:5000";
const ENDPOINT = "https://talkeeasy-backend.onrender.com";

var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    chatState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    const data = await fetchMessageApi(user.token, selectedChat._id);

    setMessages(data);
    setLoading(false);
    socket.emit("join chat", selectedChat._id);
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // give notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      event.preventDefault();
      socket.emit("stop typing", selectedChat._id);
      setNewMessage("");
      const data = await sendMessageApi(
        user.token,
        selectedChat._id,
        newMessage
      );

      socket.emit("new messages", data);
      setMessages([...messages, data]);
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <div className="h-full px-2 md:px-0">
          <div className="flex justify-between   mb-3 ">
            <button
              className="block md:hidden "
              onClick={() => setSelectedChat("")}
            >
              <i class="fa-solid fa-arrow-left"></i>
            </button>

            {!selectedChat.isGroupChat ? (
              <>
                <div className="font-serif font-semibold ">
                  {getSender(user, selectedChat.users)}
                </div>
                <div>
                  <div onClick={handleOpenModal} className="cursor-pointer">
                    <i className="fa-regular fa-eye"></i>
                  </div>
                  <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <div className=" flex flex-col  justify-between items-center">
                      <h2 className="text-xl font-semibold mb-4">
                        {getSenderFull(user, selectedChat.users).name}
                      </h2>
                      <img
                        src={getSenderFull(user, selectedChat.users).pic}
                        className="h-64 w-64 rounded-full"
                        alt=""
                      />
                      <h1>
                        <span>Email:</span>
                        {getSenderFull(user, selectedChat.users).email}
                      </h1>
                    </div>
                    <div className="flex justify-end my-4">
                      <button
                        onClick={handleCloseModal}
                        className="bg-slate-400 px-2 rounded-lg flex justify-center"
                      >
                        close
                      </button>
                    </div>
                  </Modal>
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold">
                  {selectedChat.chatName.toUpperCase()}
                </div>

                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </div>
          <div className="flex  flex-col justify-between    w-full h-[95%]">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={["#f3ccd5", "#f3ccd5", "#f3ccd5"]}
                />
              </div>
            ) : (
              <div className="messages bg-slate-100 h-full no-scrollbar">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div className="mt-2">
              <form onKeyDown={sendMessage}>
                {isTyping ? (
                  <div className="h-7 w-9">
                    <ThreeDots
                      height="60"
                      width="60"
                      radius="9"
                      color="#4fa94d"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <input
                  type="text"
                  onChange={typingHandler}
                  value={newMessage}
                  className="border bg-white w-full p-1 rounded-full"
                  placeholder="Enter a message"
                />
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full font-serif font-semibold text-xl">
          Click on a user to start chating
        </div>
      )}
    </>
  );
};

export default SingleChat;
