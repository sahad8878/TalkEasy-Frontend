import React from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../Utils/ChatLogics";
import { chatState } from "../Context/ChatProvider";
import { Avatar } from "antd";

const ScrollableChat = ({ messages }) => {
  const { user } = chatState();
  return (
    <div>
      {messages &&
        messages.map((message, i) => (
          <div key={message._id} className="flex">
            {(isSameSender(messages, message, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div title={message.sender.name}>
                <Avatar size={25} src={user.pic} />
              </div>
            )}
            <div
              className={`${
                message.sender._id === user._id
                  ? "bg-[#00000040] text-black border"
                  : "bg-black text-white"
              } rounded-2xl px-2 py-1 ${
                isSameSenderMargin(messages, message, i, user._id) === 33
                  ? "ml-8"
                  : isSameSenderMargin(messages, message, i, user._id) ===
                    "auto"
                  ? "ml-auto "
                  : ""
              } 
              ${
                isSameUser(messages, message, i, user._id)
                  ? "mt-[3px]"
                  : "mt-[10px]"
              } break-words max-w-[90%] md:max-w-[50%] `}
            >
              {message.content}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
