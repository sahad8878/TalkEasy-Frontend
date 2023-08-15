import axios from 'axios'


const instance = axios.create({
    baseURL:"https://talkeeasy-backend.onrender.com/"
})

export default instance