import React, { useEffect, useState } from "react";
import { chatState } from "../Context/ChatProvider";
import { createGroup, fetchChatsApi, searchUser } from "../Utils/Api";
import { getSender } from "../Utils/ChatLogics";
import Modal from "./Miscellaneous/Modal";

import UserItemLlist from "./UserAvatar/UserItemLlist";
import UserBadgeItem from "./UserAvatar/UserBadgeItem";

function MyChat({fetchAgain}) {
  const [loggedUser, setLoggedUser] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, selectedChat, setSelectedChat, chats, setChats } = chatState();

  const fechChats = async () => {
    console.log("chat page");
    const data = await fetchChatsApi(user.token);
    console.log(data, "chat");
    setChats(data);
  };
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    setLoading(true)
    const data = await searchUser(user.token,search)
    console.log(data,"search data form");
    setSearchResult(data)
    setLoading(false)
  };
  const handleSubmit = async() => {
  if(!groupChatName || !selectedUsers) {
   alert("please fill the group chat name")
   return
  }
    
    const data = await createGroup(user.token,groupChatName,selectedUsers)
    console.log(data,"group chat data ");
    setChats([data,...chats])
    handleCloseModal()
    alert("new group added")
  };
  const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
      alert("user already added")
      return
    }
    setSelectedUsers([...selectedUsers,userToAdd])
  };
  const handleDelete = (deleteUser) => {

    setSelectedUsers(selectedUsers.filter(sel => sel._id !== deleteUser._id))
  };




  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fechChats();
  }, [fetchAgain]);
  return (
    <div
      className={`${
        selectedChat ? "hidden" : " block"
      } md:flex md:w-[30%] w-[100%]  bg-white p-3 h-[515px]  `}
    >
      <div className="w-full ">
        <div className="  flex justify-between">
          <h1>My chats</h1>
          <button onClick={handleOpenModal} className=" p-2 bg-slate-300">
            New Group Chat <i class="fa-solid fa-plus"></i>
          </button>
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className=" sm:w-[300px]">
              <div className="text-center font-semibold text-lg">
                Greate group Chat
              </div>
              <form className="flex flex-col gap-3">
                <input
                  type="text"
                  onChange={(e) => setGroupChatName(e.target.value)}
                  className="border p-1"
                  placeholder="Chat name"
                />
                <input
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="border p-1"
                  placeholder="Add users eg:sahad"
                />
                {/* selectedl users */}
                <div className="flex flex-wrap w-[100%]">

                {selectedUsers?.map((user) => (
                  <UserBadgeItem key={user._id} user={user} handleFunction={()=> handleDelete(user)} />
                ))}
                </div>
                {/* render search users */}
                {
                  loading ? <div>loading...</div> :
                  searchResult?.slice(0,4).map((user) => (
              
                    <UserItemLlist key={user._id} user={user} 
                    handleFunction={() => handleGroup(user)}
                    />
                  ))
                }
                <div className=" text-center">
                <button className="bg-slate-300 p-1 " onClick={handleSubmit}>Create chat</button>

                </div>

              </form>

              <div className="flex justify-end my-4">
                <button
                  onClick={handleCloseModal}
                  className="bg-slate-400 px-2 rounded-lg flex justify-center"
                >
                  close
                </button>
              </div>
            </div>
          </Modal>
        </div>
        <div className="">
          {chats ? (
            <div className=" overflow-y-auto whitespace-nowrap p-4">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`${
                    selectedChat === chat
                      ? "bg-gray-800 text-white "
                      : "bg-stone-700 text-black"
                  } cursor-pointer m-2 p-1`}
                >
                  <h1>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </h1>
                </div>
              ))}
            </div>
          ) : (
            <div>spinning</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyChat;
