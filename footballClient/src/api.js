// Axios Import
import axios from 'axios'

// Set API_URL. When you deploy your application, change your_server-Side_link
export const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5050' : 'https://https://your_server-Side_link'

// Setting Axios
const api = axios.create({
    withCredentials:true,
    baseURL:API_URL
})


export default api