import request from '@/utils/request'

export const userLoginApi=(user)=>{
    return request.post('/login',user)
}