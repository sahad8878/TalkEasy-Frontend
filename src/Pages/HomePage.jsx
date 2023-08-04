import React, { useEffect, useState } from "react";
import Auth from "../Components/Auth/Auth";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [tab, setTab] = useState("login");
const navigate = useNavigate()
  const changeTab = (tab) => {
    setTab(tab);
  };

  useEffect(()=> {
  const user = JSON.parse(localStorage.getItem("userInfo"))
  if(user) navigate("/chats")
  },[navigate])
  return (
    <div className="min-h-screen bg-[#CCD5AE] flex  justify-center ">
      <div className="flex flex-col space-y-7 mt-14  ">
        <div className="bg-white rounded-lg font-semibold text-xl  flex justify-center items-center h-14">
          Chat-App
        </div>
        <div className=" bg-white rounded-lg text-base font-medium">
          <div className=" flex flex-row p-2 ">
            <div
              onClick={(e) => changeTab(e.target.id)}
              id="login"
              className={`${
                tab === "login" ? "bg-[#E9EDC9]" : "bg-white"
              } w-1/2 text-center   rounded-full p-1.5 cursor-pointer `}
            >
              Login
            </div>
            <div
              onClick={(e) => changeTab(e.target.id)}
              id="signup"
              className={`${
                tab === "signup" ? "bg-[#E9EDC9]" : "bg-white"
              } w-1/2 text-center p-1.5   rounded-full cursor-pointer`}
            >
              Sign up
            </div>
          </div>
          <div className="form-group px-3">
          <Auth tab={tab}/>

          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
