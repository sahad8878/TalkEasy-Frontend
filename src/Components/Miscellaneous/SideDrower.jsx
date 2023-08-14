import React, { useState } from "react";

import { Drawer, Dropdown, Space, Badge } from "antd";
import ProfileDropDown from "./ProfileDropDown";
import { accessChatApi, searchUser } from "../../Utils/Api";
import { chatState } from "../../Context/ChatProvider";
import UserItemLlist from "../UserAvatar/UserItemLlist";
import { getSender } from "../../Utils/ChatLogics";
import "../style.css";
import logo from "../../assets/talkeasy-logo.png";
import { ColorRing } from "react-loader-spinner";

function SideDrower() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
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

  // handle search 
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
    
      return;
    }
    setLoading(true);
    const data = await searchUser(user.token, search);
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
    <div className=" flex justify-between items-center py-1 px-8 bg-white shadow-lg  ">
      <div
        className="flex hover:text-[#f3ccd5] cursor-pointer justify-center items-center  "
        onClick={showDrawer}
      >
        <i className="fa-solid fa-magnifying-glass  "> </i>
        <span className="px-1 hidden sm:block text-base font-bold text-[10px] font-serif">
          Search User
        </span>
      </div>
      <Drawer
          title={
            <div className="flex justify-between items-center">
              Search Users
              <div onClick={onClose} className="cursor-pointer">
              <i class="fa-solid fa-xmark" ></i>
      </div>
            
            </div>
          }
        placement={"left"}
        closable={false}
        // width={300}
        onClose={onClose}
        open={open}
        key={"left"}
      >
        <input
          type="text"
        
          value={search}
          onChange={(e) => {
            handleSearch(e.target.value);
    
          }}
          className="px-2 py-1 border w-full "
          placeholder="search by name or email"
        />
   
        {loading ? (
          <div className="flex justify-center items-center ">
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
          searchResults &&
          searchResults?.map((user) => (
            <div key={user._id} className="m-1">
              <UserItemLlist
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            </div>
          ))
        )}
        {chaLoading && (
          <div className="flex justify-center items-center ">
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
      </Drawer>
      <div>
        <img src={logo} className="w-32" alt="" />
      </div>
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
                  <p>
                    {item.chat.isGroupChat
                      ? `new message in ${item.chat.chatName}`
                      : `New message from ${getSender(user, item.chat.users)}`}
                  </p>
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
          <p onClick={(e) => e.preventDefault()} className="cursor-pointer">
            <Space>
              <Badge count={notification.length} size="small">
                <i className="fa-solid fa-bell hover:text-[#f3ccd5]"></i>
              </Badge>
            </Space>
          </p>
        </Dropdown>
        <ProfileDropDown />
      </div>
    </div>
  );
}

export default SideDrower;
