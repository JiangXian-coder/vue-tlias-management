import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// axois实例对象
const request = axios.create({
    baseURL: '/api',
    timeout: 600000
})

request.interceptors.request.use((config) => {
    let loginUser = JSON.parse(localStorage.getItem('userInfo'))
    if (loginUser) {
        config.headers.token = loginUser.token
    }
    return config
})
// axios的响应拦截器
request.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem('userInfo')
            ElMessage.error('登录已过期，请重新登录')
            if (router.currentRoute.value.path !== '/login') {
                router.push('/login')
            }
        } else {
            ElMessage.error('接口访问异常')
        }
        return Promise.reject(error)
    }
)
// 导出
export default request