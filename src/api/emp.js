// 员工管理相关的 API 接口文件
import request from '@/utils/request'

// ==================== 员工查询相关接口 ====================

/**
 * 分页查询员工列表
 * @param {string} name - 员工姓名搜索条件
 * @param {string} gender - 性别搜索条件
 * @param {string} begin - 入职日期开始时间
 * @param {string} end - 入职日期结束时间
 * @param {number} page - 当前页码
 * @param {number} pageSize - 每页显示条数
 * @returns {Promise} 返回员工分页数据
 */
export const queryPageApi = (name, gender, begin, end, page, pageSize) => {
    return request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)
}

/**
 * 根据ID查询员工详情
 * @param {number} id - 员工ID
 * @returns {Promise} 返回员工详细信息
 */
export const queryReturnApi = (id) => {
    return request.get(`/emps/${id}`)
}

// ==================== 员工操作相关接口 ====================

/**
 * 新增员工
 * @param {Object} emp - 员工信息对象
 * @returns {Promise} 返回操作结果
 */
export const addEmpApi = (emp) => {
    return request.post('/emps', emp)
}

/**
 * 更新员工信息
 * @param {Object} emp - 员工信息对象（包含ID）
 * @returns {Promise} 返回操作结果
 */
export const updateEmpApi = (emp) => {
    return request.put('/emps', emp)
}

/**
 * 删除员工（支持单个或批量删除）
 * @param {number|Array} id - 员工ID或员工ID数组
 * @returns {Promise} 返回操作结果
 */
export const deleteEmpApi = (id) => {
    return request.delete(`/emps?ids=${id}`)
}