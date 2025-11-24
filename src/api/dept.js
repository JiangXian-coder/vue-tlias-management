// 引入封装的请求工具模块
import request from '@/utils/request'

/**
 * 查询所有部门数据
 * @description 向服务端发送 GET 请求获取所有部门信息
 * @returns {Promise} 返回包含部门列表数据的 Promise 对象
 */
export const queryAllApi = () => {
   return request.get('/depts')
}

/**
 * 添加新部门
 * @description 向服务端发送 POST 请求创建新的部门
 * @param {Object} dept - 部门对象，包含部门信息
 * @param {string} dept.name - 部门名称
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export const addDeptApi = (dept) => {
    return request.post('/depts', dept)
}

/**
 * 根据ID查询部门详情
 * @description 向服务端发送 GET 请求获取指定ID的部门详细信息
 * @param {number|string} id - 部门唯一标识符
 * @returns {Promise} 返回包含部门详情数据的 Promise 对象
 */
export const queryReturnApi = (id) => {
    return request.get(`/depts/${id}`)
}

/**
 * 更新部门信息
 * @description 向服务端发送 PUT 请求更新部门信息
 * @param {Object} dept - 部门对象，必须包含部门ID和其他要更新的信息
 * @param {number|string} dept.id - 部门唯一标识符
 * @param {string} dept.name - 部门名称
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export const updateDeptApi = (dept) => {
    return request.put('/depts', dept)
}

/**
 * 删除指定部门
 * @description 向服务端发送 DELETE 请求删除指定ID的部门
 * @param {number|string} id - 要删除的部门唯一标识符
 * @returns {Promise} 返回删除操作结果的 Promise 对象
 */
export const deleteDeptApi = (id) => {
    return request.delete(`/depts?id=${id}`)
}