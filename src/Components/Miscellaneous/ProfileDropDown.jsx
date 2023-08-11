// Dropdown.js
import { Avatar } from "antd";
import React, { useState } from "react";
import { chatState } from "../../Context/ChatProvider";
import Modal from "./Modal";
import { useNavigate } from "react-router";

const ProfileDropDown = ({ options, selectedOption, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = chatState();
  const navigate = useNavigate()
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const logoutHandler = ()=> {
    localStorage.removeItem("userInfo")
    navigate("/")
  }
 

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block bg-gray-300 px-2 py-.5 space-x-2 rounded hover:bg-opacity-50 focus:outline-none"
      >
        <Avatar size={25} src={user.pic} />
        <i class="fa-solid fa-chevron-down"></i>
    
      </button>
      {isOpen && (
        <ul className="absolute  right-0 bg-white shadow rounded">
          <li
         onClick={handleOpenModal}
            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
          >
            Profile
          </li>
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className=" flex flex-col justify-between items-center">
      <h2 className="text-xl font-semibold mb-4">{user.name}</h2>
        <img src={user.pic} className="h-64 w-64 rounded-full" alt="" />
        <h1><span>Email:</span>{user.email}</h1>

            </div>
        <div className="flex justify-end my-4">

        <button onClick={handleCloseModal} className="bg-slate-400 px-2 rounded-lg flex justify-center">close</button>
        </div>
      </Modal>
          <li
           
             onClick={logoutHandler}
            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
          >
           Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropDown;
