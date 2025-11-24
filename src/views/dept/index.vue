<script setup>
// 引入 Vue 的响应式引用和生命周期钩子
import { ref, onMounted } from 'vue'
// 引入部门相关的 API 接口
import {
  queryAllApi, addDeptApi, queryReturnApi, updateDeptApi,
  deleteDeptApi
} from '@/api/dept'
// 引入 Element Plus 的消息提示组件
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义部门列表数据，用于表格展示
let deptList = ref([])
// 控制部门编辑对话框的显示与隐藏
let dialogFormVisible = ref(false)
// 对话框标题，区分新增和编辑状态
let dialogTitle = ref('')
// 表单标签宽度设置
const formLabelWidth = ref('120px')

/**
 * 查询所有部门数据
 * @description 获取所有部门信息并更新到 deptList
 */
const queryAll = async () => {
  // 调用查询所有部门的 API
  const result = await queryAllApi()
  console.log(result);
  // 将返回的部门数据赋值给 deptList
  deptList.value = result.data
}

/**
 * 新增部门按钮点击事件处理函数
 * @description 打开新增部门对话框并初始化表单
 */
const add = () => {
  // 显示对话框
  dialogFormVisible.value = true
  // 初始化表单数据
  deptForm.value = { name: '' }
  // 设置对话框标题为"新增部门"
  dialogTitle.value = '新增部门'
  // 清除表单验证状态
  deptFormRef.value.clearValidate()
}

// 部门表单数据模型
let deptForm = ref({
  name: ''
})

// 表单验证规则
const fromRules = ref({
  name: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称长度在2-10个字符之间', trigger: 'blur' }
  ]
})

/**
 * 保存部门信息
 * @description 验证表单并通过 API 保存部门数据
 */
const save = async () => {
  // 表单验证
  await deptFormRef.value.validate(async valid => {
    if (!valid) {
      // 验证失败，直接返回
      return
    } else {
      let result = null
      if (deptForm.value.id) {
        result = await updateDeptApi(deptForm.value)
      } else {
        result = await addDeptApi(deptForm.value)
      }
      if (result.code) {
        // 操作成功提示
        ElMessage.success('操作成功')
        // 关闭对话框
        dialogFormVisible.value = false
        // 重置表单
        resetForm()
        console.log('重置');
        // 重新加载部门数据
        queryAll()
      } else {
        // 操作失败提示
        ElMessage.error(result.msg)
      }
    }
  })
}

// 表单引用，用于表单验证和重置
const deptFormRef = ref(null)

/**
 * 重置表单
 * @description 清空表单内容并重置验证状态
 */
const resetForm = () => {
  deptFormRef.value.resetFields()
}

// 组件挂载完成后执行查询所有部门数据
onMounted(() => {
  queryAll()
})

/**
 * 编辑部门按钮点击事件处理函数
 * @description 打开编辑部门对话框并初始化表单
 */
const editDept = async (id) => {
  // 显示对话框
  dialogFormVisible.value = true
  // 初始化表单数据
  deptForm.value = { name: '' }
  // 设置对话框标题为"编辑部门"
  dialogTitle.value = '编辑部门'
  // 清除表单验证状态
  deptFormRef.value.clearValidate()

  const result = await queryReturnApi(id)
  if (result.code) {
    deptForm.value = result.data
  }

}

const deleteDept = async (id) => {
  const result = await queryReturnApi(id)
  const deptName = result.data.name
  ElMessageBox.confirm(
      `是否继续删除该<${deptName}>部门吗?`,
    '提示',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const result = await deleteDeptApi(id)
    if (result.code) {
      ElMessage.success('删除成功')
      queryAll()
    }
  })
  .catch(()=>{
    ElMessage.info('已取消删除')
  })

}
</script>

<template>
  <!-- 页面标题 -->
  <h1>部门管理</h1>

  <!-- 新增部门按钮区域 -->
  <div>
    <br>
    <el-button type="primary" @click="add()">新增部门</el-button>
  </div>

  <!-- 部门数据表格 -->
  <div>
    <br>
    <el-table :data="deptList" border style="width: 100%">
      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="180" align="center" />
      <!-- 部门名称列 -->
      <el-table-column prop="name" label="部门名称" width="180" align="center" />
      <!-- 最后修改时间列 -->
      <el-table-column prop="updateTime" label="最后修改时间" width="240" align="center" />
      <!-- 操作列 -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <!-- 编辑按钮 -->
          <el-button size="small" type="primary" @click="editDept(scope.row.id)">编辑</el-button>
          <!-- 删除按钮 -->
          <el-button size="small" type="danger" @click="deleteDept(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 部门编辑对话框 -->
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500">
    <!-- 部门表单 -->
    <el-form :model="deptForm" :rules="fromRules" ref="deptFormRef">
      <!-- 部门名称输入项 -->
      <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="deptForm.name" autocomplete="off" />
      </el-form-item>
    </el-form>

    <!-- 对话框底部操作按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
