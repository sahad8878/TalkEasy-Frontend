import React, { useState } from "react";

import { Drawer, Dropdown, Space, Badge } from "antd";
import ProfileDropDown from "./ProfileDropDown";
import { accessChatApi, searchUser } from "../../Utils/Api";
import { chatState } from "../../Context/ChatProvider";
import UserItemLlist from "../UserAvatar/UserItemLlist";
import { getSender } from "../../Utils/ChatLogics";
import '../style.css'

function SideDrower() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [chaLoading, setChatLoading] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = chatState();

  const menuStyle = {
    boxShadow: "none",
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleSearch = async () => {
    if (!search) {
      setSearchResults([]);
      setError("Enter search values");

      return;
    }
    setLoading(true);
    const data = await searchUser(user.token, search);
    console.log(data, "search");
    setSearchResults(data);
    setLoading(false);
  };

  const accessChat = async (userId) => {
    console.log(userId, "userId");
    setChatLoading(true);
    const data = await accessChatApi(userId, user.token);

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
    setSelectedChat(data);
    setChatLoading(false);
    onClose();
  };

  return (
    <div className=" flex justify-between items-center py-5 px-3 dots-pattern  ">
      <div
        className="flex hover:bg-[#CCD5AE] cursor-pointer "
        onClick={showDrawer}
      >
        <i className="fa-solid fa-magnifying-glass  "> </i>
        <span className="px-1 hidden sm:block text-base font-bold text-[10px] font-serif">
          Search User
        </span>
      </div>
      <Drawer
        title="Searach Users"
        placement={"left"}
        closable={false}
        width={300}
        onClose={onClose}
        open={open}
        key={"left"}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setError("");
          }}
          className="px-2 py-1 border "
          placeholder="search by name or email"
        />
        <button onClick={handleSearch} className="bg-slate-300 py-1 px-3 ml-1">
          Go
        </button>
        {error !== "" && <h1 className="text-red-500">{error}</h1>}
        {loading ? (
          <div>loading</div>
        ) : (
          searchResults &&
          searchResults?.map((user) => (
            <UserItemLlist
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
            />
          ))
        )}
        {chaLoading && <div>spinning.....</div>}
      </Drawer>
      <h1>TalkEasy</h1>
      <div className="flex justify-center items-center gap-4">
        <Dropdown
          overlay={
            <div className="bg-white shadow rounded-md">
              {/* Render notification content dynamically */}
              {!notification.length && (
                <div className="p-2 bg-white shadow rounded-md">
                  No messages
                </div>
              )}
              {notification.map((item) => (
                <div
                  key={item.key}
                  className="p-2 bg-white shadow rounded-md"
                  onClick={() => {
                    setSelectedChat(item.chat);
                    setNotification(notification.filter((n) => n !== item));
                  }}
                >
                  <a target="_blank" rel="noopener noreferrer" href={item.link}>
                    {item.chat.isGroupChat
                      ? `new message in ${item.chat.chatName}`
                      : `New message from ${getSender(user, item.chat.users)}`}
                  </a>
                </div>
              ))}
            </div>
          }
          dropdownRender={(menu) => (
            <div>
              {React.cloneElement(menu, {
                style: menuStyle,
              })}
            </div>
          )}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Badge count={notification.length} size="small">
                <i class="fa-solid fa-bell"></i>
              </Badge>
            </Space>
          </a>
        </Dropdown>
        <ProfileDropDown />
      </div>
    </div>
  );
}

export default SideDrower;
