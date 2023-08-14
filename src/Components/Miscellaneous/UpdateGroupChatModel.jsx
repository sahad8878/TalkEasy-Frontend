import React, { useState } from "react";
import Modal from "./Modal";
import { chatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import {
  addToGroup,
  removeFromGroup,
  renameGroupName,
  searchUser,
} from "../../Utils/Api";
import UserItemLlist from "../UserAvatar/UserItemLlist";
import { message } from "antd";
import { ColorRing } from "react-loader-spinner";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setrenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = chatState();
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      message.info("user already  in group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      message.info("only admins can add someone ");
      return;
    }
    setLoading(true);

    const data = await addToGroup(user.token, selectedChat._id, user1._id);
    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
  };

  // handle romove users from group
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      message.info("only admins can remove someone");
      return;
    }

    setLoading(true);
    const data = await removeFromGroup(user.token, selectedChat._id, user1._id);
    user._id === user1._id ? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    fetchMessages();
    setLoading(false);
  };

  // Rename group name
  const handleRename = async () => {
    if (!groupChatName) return;
    setrenameLoading(true);
    const data = await renameGroupName(
      user.token,
      selectedChat._id,
      groupChatName
    );
    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setrenameLoading(false);
    setGroupChatName("");
  };

  // search the user for add new users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    setLoading(true);
    const data = await searchUser(user.token, search);
    setSearchResult(data);
    setLoading(false);
  };
  
  return (
    <>
      <div onClick={handleOpenModal} className="cursor-pointer">
        <i class="fa-regular fa-eye"></i>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="space-y-5 max-w-[300px] md:w-[300px]">
          <div className="text-center font-semibold text-lg">
            {selectedChat.chatName}
          </div>
          <div className="flex flex-wrap w-[100%]">
            {selectedChat?.users?.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={() => handleRemove(user)}
              />
            ))}
          </div>
          <div></div>
          <form className="flex justify-start ">
            <input
              type="text"
              className="border mr-2 p-1 w-full"
              placeholder="Chat Name"
              defaultValue={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <button
              type="button"
              className="bg-gray-200 px-1 rounded-md font-medium hover:opacity-75"
              onClick={handleRename}
            >
              Update
            </button>
          </form>
          {renameLoading && (
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
          )}
          <form>
            <input
              type="text"
              className="border p-1  w-full"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Add user to group"
            />
            <div>
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
                searchResult?.map((user) => (
                  <div className="m-1" key={user._id}>
                    <UserItemLlist
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  </div>
                ))
              )}
            </div>
          </form>
          <div className="flex justify-center">
            <button
              onClick={() => handleRemove(user)}
              className="bg-red-400 font-medium py-1 px-2 rounded-md hover:opacity-75"
            >
              Leave group
            </button>
          </div>
        </div>
        <div className="flex justify-end my-4">
          <button
            onClick={handleCloseModal}
            className="bg-slate-400 px-2 rounded-lg flex justify-center hover:opacity-75"
          >
            close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
