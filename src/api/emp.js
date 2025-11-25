import request from '@/utils/request'

export const queryPageApi=(name,gender,begin,end,page,pageSize)=>{
    return request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)
}
export const addEmpApi=(emp)=>{
    return request.post('/emps',emp)
}
export const queryReturnApi=(id)=>{
    return request.
    get(`/emps/${id}`)
}
export const updateEmpApi=(emp)=>{
    return request.put('/emps',emp)
}
export const deleteEmpApi=(id)=>{
    return request.delete(`/emps?ids=${id}`)
}