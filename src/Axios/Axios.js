import axios from 'axios'


const instance = axios.create({
    // baseURL:"http://localhost:5000/"
    baseURL:"https://talkeeasy-backend.onrender.com/"
})

export default instance