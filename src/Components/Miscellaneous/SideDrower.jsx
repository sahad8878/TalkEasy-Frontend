import React, { useState } from "react";
import { Drawer } from "antd";
import Dropdown from "./Dropdown";
import { accessChatApi, searchUser } from "../../Utils/Api";
import { chatState } from "../../Context/ChatProvider";
import UserItemLlist from "../UserAvatar/UserItemLlist";

function SideDrower() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState();
  const [error, setError] = useState("");
  const [loading,setLoading] = useState(false)
  const [searchResults,setSearchResults] = useState([])
const [chaLoading,setChatLoading] = useState()

  const { user,setSelectedChat,chats,setChats } = chatState()

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleSearch = async () => {
    if (!search) {
      setSearchResults([])
      setError("Enter search values");
      
      return
    }
    setLoading(true)
    const data = await searchUser(user.token,search)
    console.log(data,"search");
    setSearchResults(data)
    setLoading(false)
  };

  const accessChat = async(userId) => {
    console.log(userId,"userId");
    setChatLoading(true)
    const data = await accessChatApi(userId,user.token)

    if(!chats.find((c) => c._id === data._id)) setChats([data,...chats])
     setSelectedChat(data)
    setChatLoading(false)
    onClose()

  }

  return (
    <div className=" flex justify-between items-center py-5 px-3 bg-white  ">
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
        {loading ? 
       <div>loading</div>:
       searchResults && searchResults?.map((user) => (
            <UserItemLlist key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
          ))
      }
      {chaLoading && <div>spinning.....</div>}
      </Drawer>
      <h1>Chat-App</h1>
      <div className="flex justify-center items-center gap-4">
        <i class="fa-solid fa-bell"></i>
        <Dropdown />
      </div>
    </div>
  );
}

export default SideDrower;
