import { Avatar } from 'antd'
import React from 'react'

function UserItemLlist({user,handleFunction}) {

  return (
    <div onClick={handleFunction} className='flex px-1 py-1 bg-slate-100 hover:bg-slate-300 cursor-pointer  space-x-1 text-xs rounded-lg'>
   <div className=' flex justify-center items-center'>
   <Avatar size={25} src={user.pic} />
   </div>
   <div className=''>
     <h1 className='text-sm'>{user.name}</h1>
     <h1>Email: {user.email}</h1>
   </div>
      
    </div>
  )
}

export default UserItemLlist
