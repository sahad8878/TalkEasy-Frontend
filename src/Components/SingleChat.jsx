import React, { useEffect, useState } from "react";
import { chatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../Utils/ChatLogics";
import Modal from "./Miscellaneous/Modal";
import UpdateGroupChatModel from "./Miscellaneous/UpdateGroupChatModel";
import { fetchMessageApi, sendMessageApi } from "../Utils/Api";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import { useLottie } from "lottie-react";
import typingAnimation from "../Animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const { user, selectedChat, setSelectedChat,notification,setNotification } = chatState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected,setSocketConnected] = useState(false)
  const [typing,setTyping] = useState(false)
  const [isTyping,setIsTyping] = useState(false)
  const options = {
    animationData: typingAnimation,
    loop: true,
    autoplay:true
  };

  const { View } = useLottie(options);

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
    socket.emit("join chat",selectedChat._id)
  };
  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup",user)
    socket.on("connected",() => setSocketConnected(true))
    socket.on("typing",() => setIsTyping(true))
    socket.on("stop typing",() => setIsTyping(false))
     },[])

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat  
  }, [selectedChat]);
  console.log(notification,"notification------------------");

  useEffect(()=> {
    socket.on("message recieved",(newMessageRecieved) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
        // give notification
        if(!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved,...notification])
          setFetchAgain(!fetchAgain)
        }

      }else {
        setMessages([...messages,newMessageRecieved])
      }
    })
  })

 

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      event.preventDefault();
socket.emit("stop typing",selectedChat._id)
      setNewMessage("");
      const data = await sendMessageApi(
        user.token,
        selectedChat._id,
        newMessage
      );

      socket.emit("new messages",data)
      setMessages([...messages, data]);
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if(!socketConnected) return

    if(!typing) {
      setTyping(true)
      socket.emit("typing",selectedChat._id)
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime

      if(timeDiff >= timerLength && typing) {
        socket.emit("stop typing",selectedChat._id)
        setTyping(false)
      }
    },timerLength)
  };


  return (
    <>
      {selectedChat ? (
        <div className="h-full">
          <div className="flex justify-between mb-3">
            <button
              className="block md:hidden"
              onClick={() => setSelectedChat("")}
            >
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <div>
                  <div onClick={handleOpenModal}>
                    <i className="fa-regular fa-eye"></i>
                  </div>
                  <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <div className=" flex flex-col justify-between items-center">
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
              <div className="flex w-full justify-between ">
                <div>{selectedChat.chatName.toUpperCase()}</div>
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </div>
            )}
          </div>
          <div className="bg-slate-300   w-full h-[90%]">
            {loading ? (
              <div className="flex justify-center items-center h-[90%]">
                Loading
              </div>
            ) : (
              <div className="messages ">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <form onKeyDown={sendMessage}>
              {isTyping ? <div className="h-7 w-9">loading</div> : <></>}
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
      ) : (
        <div>Click on a user to start chating</div>
      )}
    </>
  );
};

export default SingleChat;
