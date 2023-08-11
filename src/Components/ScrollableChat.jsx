import React from "react";
import ScrollableFeed from "react-scrollable-feed";
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
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => (
          <div key={message._id} className="flex">
            {(isSameSender(messages, message, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div title={message.sender.name}>
                <Avatar size={25} src={user.pic} />
              </div>
            )}
            <span
              className={`${
                message.sender._id === user._id
                  ? "bg-red-400"
                  : "bg-fuchsia-400"
              } rounded-2xl ${
                isSameSenderMargin(messages, message, i, user._id) === 33
                  ? "ml-8"
                  : isSameSenderMargin(messages, message, i, user._id) ===
                    "auto"
                  ? "ml-auto"
                  : ""
              } 
              ${isSameUser(messages,message,i,user._id) ? "mt-[3px]" :"mt-[10px]"}
              `}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
