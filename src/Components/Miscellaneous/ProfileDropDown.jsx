// Dropdown.js
import { Avatar, Dropdown, Space } from "antd";
import React, { useState } from "react";
import { chatState } from "../../Context/ChatProvider";
import Modal from "./Modal";
import { useNavigate } from "react-router";

const ProfileDropDown = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = chatState();
  const navigate = useNavigate();
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const menuStyle = {
    boxShadow: "none",
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <Dropdown
      overlay={
        <div className="bg-white shadow rounded-md ">
          <div
            onClick={handleOpenModal}
            className="p-2 pr-10 bg-white shadow cursor-pointer hover:bg-slate-100 "
          >
            Profile
          </div>
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className=" flex flex-col justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">{user.name}</h2>
              <img src={user.pic} className="h-64 w-64 rounded-full" alt="" />
              <h1>
                <span>Email:</span>
                {user.email}
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
          <div
            onClick={logoutHandler}
            className="p-2 pr-10 bg-white shadow cursor-pointer hover:bg-slate-100"
          >
            Log out
          </div>
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
          <div className="block md:hidden">
          <Avatar size={25} src={user.pic} />

          </div>
          <div className="hidden md:block shadow hover:bg-[#f3ccd5] px-2 py-.5 space-x-2 rounded hover:bg-opacity-50 focus:outline-none">
            <Avatar size={25} src={user.pic} />
            <i class="fa-solid fa-chevron-down"></i>
          </div>
        </Space>
      </p>
    </Dropdown>
  );
};

export default ProfileDropDown;
