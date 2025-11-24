import axios from'axios'

// axois实例对象
const request = axios.create({
    baseURL:'/api',
    timeout:600000
})

// axios的响应拦截器
request.interceptors.response.use(
    (response)=>{
        return response.data
    },
    (error)=>{
        return Promise.reject(error)
    }
)
// 导出
export default request