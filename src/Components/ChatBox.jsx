import React from 'react'
import { chatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat'

function ChatBox({fetchAgain,setFetchAgain}) {

const {selectedChat} = chatState()

  return (
    <div className={`
    ${selectedChat ? "block" : "hidden"} 
     md:block w-[100%] md:w-[70%] bg-white md:p-3 h-[400px] md:h-[600px] 
  
    `}>
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  )
}

export default ChatBox
