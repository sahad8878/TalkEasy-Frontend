import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { registerUser, loginUser } from "../../Utils/Api";

function Auth({ tab }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      message.error("Picture is empty");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "wwviwsyy");
      data.append("cloud_name", "deovgjvlr");

      const postImages = async () => {
        try {
          const res = await axios.post(
            "https://api.cloudinary.com/v1_1/deovgjvlr/upload",
            data
          );
          setPic(res.data.url);
          setLoading(false);
        } catch (err) {
          console.log(err, "err");
          setLoading(false);
        }
      };
      postImages();
    } else {
      message.error("please select a image");

      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (tab === "login") {
      if (!email || !password) {
        message.error("please fill all the fields");
        setLoading(false);
        return;
      }
      const postData = { email, password };
      try {
        const data = await loginUser(postData);
        message.success("Your successfully logged in");
        localStorage.setItem("userInfo", JSON.stringify(data));
      } catch (error) {
        message.error(error.response.data.message);
        setLoading(false);
        return;
      }
    } else {
      if (!email || !name || !password || !confirmPassword) {
        message.error("please fill all the fields");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        message.error("Password do not match");

        setLoading(false);

        return;
      }
      const forData = {
        name,
        email,
        password,
        pic,
      };
      try {
        const data = await registerUser(forData);
        message.success("Your registration has been successfully completed");
        localStorage.setItem("userInfo", JSON.stringify(data));
      } catch (error) {
        message.error(error.response.data.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    navigate("/chats");
  };

  return (
    <form className="my-8 space-y-3">
      {tab === "signup" && (
        <div className="flex flex-col  space-y-1">
          <label htmlFor="name ">Name</label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            className=" min-w-[350px] sm:w-[500px] p-1 rounded-md "
          />
        </div>
      )}
      <div className="flex flex-col space-y-1 ">
        <label htmlFor="email ">Email</label>
        <input
          type="text"
          defaultValue={tab === "login" && email ? email : ""}
          onChange={(e) => setEmail(e.target.value)}
          className=" min-w-[300px] sm:w-[500px] p-1  rounded-md"
        />
      </div>
      <div className="flex flex-col space-y-1 ">
        <label htmlFor="email ">Password</label>
        <input
          type={show ? "text" : "password"}
          defaultValue={tab === "login" ? password : ""}
          onChange={(e) => setPassword(e.target.value)}
          className=" min-w-[300px] sm:w-[500px] p-1 rounded-md  "
        />
        <div className="bg-slate-400 flex justify-end">
          <div
            onClick={() => setShow(!show)}
            className=" -mt-8 mr-1 cursor-pointer bg-gray-200 w-12 h-6 text-center font-normal text-sm"
          >
            {show ? "Hide" : "Show"}
          </div>
        </div>
      </div>
      {tab === "signup" && (
        <div className="flex flex-col space-y-1">
          <label htmlFor="email ">Confirm Password</label>
          <input
            type={show ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className=" min-w-[300px] sm:w-[500px] p-1 rounded-md  "
          />
          <div className="bg-slate-400 flex justify-end ">
            <div
              onClick={() => setShow(!show)}
              className=" -mt-8 mr-1 cursor-pointer bg-gray-200 w-12 h-6 text-center font-normal text-sm"
            >
              {show ? "Hide" : "Show"}
            </div>
          </div>
        </div>
      )}
      {tab === "signup" && (
        <div className="flex flex-col space-y-1">
          <label htmlFor="name ">Upload your picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
            className=" min-w-[300px] sm:w-[500px] p-.5 bg-white  rounded-md"
          />
        </div>
      )}
      <div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          type="button"
          className="bg-[#f3ccd5] rounded-lg hover:bg-opacity-75 w-full p-1.5 mt-6"
        >
          {loading ? "Loading.. " : tab === "login" ? "Login" : "Signup"}
        </button>
      </div>
    </form>
  );
}

export default Auth;
