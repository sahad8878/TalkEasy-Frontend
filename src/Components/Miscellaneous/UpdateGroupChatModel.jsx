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
      alert("user already  in group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("only admins can add someone ");
      return;
    }
    setLoading(true);

    const data = await addToGroup(user.token, selectedChat._id, user1._id);
    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
  };
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("only admins can remove someone");
      return;
    }

    setLoading(true);
    const data = await removeFromGroup(user.token, selectedChat._id, user1._id);
    user._id === user1._id ? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
  };

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
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    setLoading(true);
    const data = await searchUser(user.token, search);
    console.log(data, "search data form");
    setSearchResult(data);
    setLoading(false);
  };
  return (
    <>
      <div onClick={handleOpenModal}>
        <i class="fa-regular fa-eye"></i>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="space-y-5">                   
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
          <form className="flex justify-center space-x-2">
            <input
              type="text"
              className="border"
              placeholder="Chat Name"
              defaultValue={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <button
              type="button"
              className="bg-gray-500"
              onClick={handleRename}
            >
              Update
            </button>
          </form>
          <form>
            <input
              type="text"
              className="border"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Add user to group"
            />
            <div>
              {loading ? (
                <div>Loading..</div>
              ) : (
                searchResult?.map((user) => (
                  <UserItemLlist
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </div>
          </form>
          <button onClick={() => handleRemove(user)} className="bg-red-500">
            Leave group
          </button>
        </div>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
