import React from 'react'
import { chatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat'

function ChatBox({fetchAgain,setFetchAgain}) {

const {selectedChat} = chatState()

  return (
    <div className={`
    ${selectedChat ? "block" : "hidden"} 
     md:block w-[70%] bg-white p-3 h-[515px] 
    
    `}>
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  )
}

export default ChatBox
