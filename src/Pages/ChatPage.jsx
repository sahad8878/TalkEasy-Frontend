import React, { useState } from 'react'
import { chatState } from '../Context/ChatProvider'
import SideDrower from '../Components/Miscellaneous/SideDrower'
import MyChat from '../Components/MyChat'
import ChatBox from '../Components/ChatBox'

function ChatPage() {
  const { user } = chatState();
const [fetchAgain,setFetchAgain] = useState(false)
  return (
    <div className='bg-[#CCD5AE] h-screen flex flex-col'> {/* Use 'flex-col' to stack child elements vertically */}
      {user && <SideDrower/>}
      <div className='flex-grow flex justify-between px-10 pt-10 gap-5'> {/* Use 'flex-grow' to make this div expand to fill the remaining height */}
        {user && <MyChat fetchAgain={fetchAgain}  />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </div>
    </div>
  );
}

export default ChatPage;
