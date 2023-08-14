import React, { useEffect, useState } from "react";
import { chatState } from "../Context/ChatProvider";
import { createGroup, fetchChatsApi, searchUser } from "../Utils/Api";
import { getSender } from "../Utils/ChatLogics";
import Modal from "./Miscellaneous/Modal";

import UserItemLlist from "./UserAvatar/UserItemLlist";
import UserBadgeItem from "./UserAvatar/UserBadgeItem";
import { Tooltip, message } from "antd";
import { ColorRing } from "react-loader-spinner";

function MyChat({ fetchAgain,setFetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, selectedChat, setSelectedChat, chats, setChats } = chatState();

  const fechChats = async () => {
    const data = await fetchChatsApi(user.token);
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
      setSearchResult([])
      return;
    }
    setLoading(true);
    const data = await searchUser(user.token, search);
    setSearchResult(data);
    setLoading(false);
  };
  
  // handle the group creation
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!groupChatName ) {
      message.info("Please fill the group chat name");
      return;
    }
    if(selectedUsers.length < 2){
      message.info("Please select minimum 2 users");
      return;
    }

    const data = await createGroup(user.token, groupChatName, selectedUsers);
    setChats([data, ...chats]);
    setFetchAgain(!fetchAgain)
    handleCloseModal();
    setSearchResult([])
    setSelectedUsers([])
    setGroupChatName("")
    message.success("New group added successfully");
  };

  // add user to group
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      message.info("User already exists in the group");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // delete user from the selected users list
  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deleteUser._id));
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fechChats();
  }, [fetchAgain]);

  return (
    <div
      className={`${
        selectedChat ? "hidden" : " block"
      } md:flex md:w-[30%] w-[100%] h-[400px] md:h-[600px] bg-white p-3  flex-col justify-between `}
    >
      <div className="w-full ">
        <div className="  ">
          <h1 className="font-serif text-lg font-medium">My chats</h1>

          {/* modal */}
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className=" sm:w-[300px]">
              <div className="text-center font-semibold font-serif mb-4 text-lg">
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
                    <UserBadgeItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleDelete(user)}
                    />
                  ))}
                </div>
                {/* render search users */}
                {loading ? (
                  <div className=" flex justify-center items-center ">
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
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserItemLlist
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
                <div className=" text-center">
                  <button
                    className="bg-slate-400 hover:opacity-75 p-1 font-medium rounded-lg "
                    onClick={handleSubmit}
                  >
                    Create chat
                  </button>
                </div>
              </form>

              <div className="flex justify-end my-4">
                <button
                  onClick={handleCloseModal}
                  className="bg-slate-200 px-4 rounded-lg flex justify-center"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
          {/* modal end */}
        </div>
        <div className="h-[300px] md:h-[400px] no-scrollbar overflow-y-scroll">
          {chats ? (
            <div className=" overflow-y-auto whitespace-nowrap ">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`${
                    selectedChat === chat
                      ? "bg-slate-100 text-vlack "
                      : "bg-white shadow-sm text-black"
                  } cursor-pointer hover:bg-slate-100 m-2 p-1`}
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
            <div className=" flex justify-center items-center mt-10">
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
          )}
        </div>
      </div>
      <div className="">
        <Tooltip placement="bottom" title={"Create new group"}>
          <button
            onClick={handleOpenModal}
            className=" w-10 h-10 shadow hover:bg-[#f3ccd5] rounded-full"
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default MyChat;
