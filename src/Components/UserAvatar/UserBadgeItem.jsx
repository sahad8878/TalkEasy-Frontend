import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <div onClick={handleFunction} className='bg-slate-300 rounded-md px-1 text-sm cursor-pointer m-1 '>
     
      <span className='mr-1'> {user.name}</span>
      <i class="fa-solid fa-xmark" ></i>
    </div>
  )
}

export default UserBadgeItem

