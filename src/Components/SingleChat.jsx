import React, { useState } from "react";
import { chatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../Utils/ChatLogics";
import Modal from "./Miscellaneous/Modal";
import UpdateGroupChatModel from "./Miscellaneous/UpdateGroupChatModel";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = chatState();
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
                    <i class="fa-regular fa-eye"></i>
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
              <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </div>
            )}
          </div>
          <div className="bg-slate-300   w-full h-[90%]"></div>
        </div>
      ) : (
        <div>Click on a user to start chating</div>
      )}
    </>
  );
};

export default SingleChat;
