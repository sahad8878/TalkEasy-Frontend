import axios from "../Axios/Axios";

export const registerUser = async (postData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post("/api/user/register", postData, config);
    return response.data;
  } catch (error) {
    console.log("error occured in register user =" + error);
    throw error;
  }
};

export const loginUser = async (postData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post("/api/user/login", postData, config);
    return response.data
  } catch (error) {
    console.log("error occured in login user =" + error);
    throw error;
  }
};

export const searchUser = async (token,search) => {

  try {
    const config = {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }

    const response = await axios.get(`/api/user/searchUser?search=${search}`,config)
    return response.data
  } catch (error) {
    console.log("error occured in search user =" + error);
    throw error;
  }
}


export const accessChatApi = async (userId,token) => {
  try {
    const config = {
      headers:{
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      }
    }
    const response = await axios.post("/api/chat",{userId},config)
    return response.data
  } catch (error) {
    console.log("error occured in accessChatApi =" + error);
    throw error;
  }
}

export const fetchChatsApi = async (token) => {
  try {
    const config = {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
    const response = await axios.get("/api/chat",config)
    return response.data
  } catch (error) {
    console.log("error occured in accessChatApi =" + error);
    throw error;
  }
}


export const createGroup = async (token,name,selectedUsers) =>{

  try {
    const config = {
      headers:{
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      }
    }

    const response = await axios.post("/api/chat/group",{name,users:JSON.stringify(selectedUsers.map((user) => user._id))},config)
    return response.data

    
  } catch (error) {
    console.log("error occured in accessChatApi =" + error);
    throw error;
  }
}

export const renameGroupName = async (token,chatId,chatName) => {
  try {
    const config = {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
    const response = await axios.put("/api/chat/renameGroup",{chatId,chatName},config)
    return response.data
  } catch (error) {
    console.log("error occured in renameGroup chat =" + error);
    throw error;
  }
}

export const addToGroup = async (token,chatId,userId) => {
  try {
    const config = {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
    const response = await axios.put("/api/chat/addToGroup",{chatId,userId},config)
    return response.data
  } catch (error) {
    console.log("error occured in addToGroup =" + error);
    throw error;
  }
}

export const removeFromGroup = async (token,chatId,userId) => {
  try {
    const config = {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
    const response = await axios.put("/api/chat/removeFromGroup",{chatId,userId},config)
    return response.data
  } catch (error) {
    console.log("error occured in removeFromGroup =" + error);
    throw error;
  }
}