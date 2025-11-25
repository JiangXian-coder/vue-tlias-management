<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  queryPageApi, addEmpApi,
  queryReturnApi, updateEmpApi,
  deleteEmpApi
} from '@/api/emp'
import { queryAllApi as queryDeptApi } from '@/api/dept'
import { ElMessage, ElMessageBox } from 'element-plus'

// 员工搜索条件数据
const empSearchInfo = ref({
  name: '',
  gender: '',
  date: [],
  begin: '',
  end: ''
})
const jobMap = {
  1: '班主任',
  2: '讲师',
  3: '学工主管',
  4: '教研主管',
  5: '咨询师'
}
// 分页相关数据
let currentPage = ref(1)
let pageSize = ref(10)
let total = ref(80)

// 监听日期范围变化，自动设置开始和结束日期
watch(() => empSearchInfo.value.date, (newVal, oldVal) => {
  if (newVal.length == 2) {
    empSearchInfo.value.begin = newVal[0]
    empSearchInfo.value.end = newVal[1]
  } else {
    empSearchInfo.value.begin = ''
    empSearchInfo.value.end = ''
  }
})

// 清空搜索条件
const clearSearchInfo = () => {
  empSearchInfo.value = {
    name: '',
    gender: '',
    date: [],
    begin: '',
    end: ''
  }
  searchEmp()
}

// 查询员工列表
const searchEmp = async () => {
  const result = await queryPageApi(empSearchInfo.value.name,
    empSearchInfo.value.gender,
    empSearchInfo.value.begin,
    empSearchInfo.value.end,
    currentPage.value,
    pageSize.value
  )
  console.log(`result${result}`);
  if (result.code) {
    empList.value = result.data.rows
    total.value = result.data.total
  } else {
    ElMessage.error(result.message)
  }
}

// 组件挂载时初始化数据
onMounted(async () => {
  searchEmp()

  const result = await queryDeptApi()
  if (result.code) {
    deptList.value = result.data
  } else {
    ElMessage.error(result.message)
  }
})

// 员工列表数据
const empList = ref([])

// 处理每页显示条数变化
const handleSizeChange = (val) => {
  searchEmp()
}

// 处理当前页码变化
const handleCurrentChange = (val) => {
  searchEmp()
}

let dialogVisible = ref(false)

const addEmp = async () => {
  dialogVisible.value = true
  dialogTitle.value = '新增员工'
  resetForm()
}

let dialogTitle = ref('')

// 新增员工表单数据
const empInfo = ref({
  username: '',      // 用户名
  name: '',          // 姓名
  gender: '',        // 性别
  phone: '',         // 手机号
  job: '',           // 职位
  salary: '',        // 薪资
  deptId: '',        // 所属部门ID
  entryDate: '',     // 入职日期
  image: '',         // 头像URL
  workExperiences: [] // 工作经历数组
})

const addEmpExper = () => {
  empInfo.value.workExperiences.push({
    begin: '',
    end: '',
    company: '',
    job: '',
    experDate: []
  })
}

watch(() => empInfo.value.workExperiences, (newVal, oldVal) => {
  if (empInfo.value.workExperiences &&
    empInfo.value.workExperiences.length > 0) {
    empInfo.value.workExperiences.forEach(exper => {
      if (exper.experDate && exper.experDate.length == 2) {
        exper.begin = exper.experDate[0]
        exper.end = exper.experDate[1]
      } else {
        exper.begin = ''
        exper.end = ''
      }

    })
  }
  console.log(empInfo.value.workExperiences)
}, { deep: true })

const deleteExper = (index) => {
  empInfo.value.workExperiences.splice(index, 1)
}
// 性别选项数据
const genders = ref([
  { name: '男', value: '1' },
  { name: '女', value: '2' }
])

// 职位选项数据
const jobs = ref([
  { name: '班主任', value: '1' },
  { name: '讲师', value: '2' },
  { name: '学工主管', value: '3' },
  { name: '咨询师', value: '4' }
])

// 部门列表数据（示例）
const deptList = ref([])

const handleAvatarSuccess = (response, uploadFile) => {
  empInfo.value.image = response.data
}
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  return true
}

const saveEmp = async () => {
  try {
    await empFromRef.value.validate()
    let result = null
    if (empInfo.value.id) {
      result = await updateEmpApi(empInfo.value)
    } else {
      result = await addEmpApi(empInfo.value)

    }
    if (result.code) {
      ElMessage.success('保存员工成功')
      dialogVisible.value = false
      searchEmp()
    } else {
      ElMessage.error('保存员工失败')
    }

  }
  catch (error) {
    ElMessage.error("校验失败")
  }
}
const clearFromValidate = () => {
  empFromRef.value.resetFields()
}
const clearFromData = () => {
  empInfo.value = {
    username: '',      // 用户名
    name: '',          // 姓名
    gender: '',        // 性别
    phone: '',         // 手机号
    job: '',           // 职位
    salary: '',        // 薪资
    deptId: '',        // 所属部门ID
    entryDate: '',     // 入职日期
    image: '',         // 头像URL
    workExperiences: [] // 工作经历数组
  }
}
const resetForm = () => {
  clearFromData()
  clearFromValidate()
}

const empFromRef = ref(null)

const empFormRules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应在2到20个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度应在2到10个字符之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '性别不能为空', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { len: 11, message: '手机号长度应为11位', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ]
}
const queryEmpById = async (id) => {
  const result = await queryReturnApi(id)
  if (result.code) {
    const empWorkExperiences = (result.data.exprList || []).map(
      exper => ({

        ...exper,
        experDate: [exper.begin, exper.end]

      })
    )
    empInfo.value = {
      ...result.data,
      workExperiences: empWorkExperiences
    }
  } else {
    ElMessage.error(result.message)
  }
}
const editEmp = (id) => {
  dialogTitle.value = '编辑员工'
  dialogVisible.value = true
  queryEmpById(id)
}
const deleteEmp = async (id) => {
  ElMessageBox.confirm(
    '你确定删除该员工吗?',
    '提示',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const result = await deleteEmpApi(id)
      if (result.code) {
        ElMessage.success('删除员工成功')
        searchEmp()
      } else {
        ElMessage.error(result.msg)
      }
    }).catch(()=>{
      ElMessage.info('已取消删除')
    })
}

const selectIds = ref([])
const handleSelectionChange = (selection) => {
  selectIds.value = selection.map(emp => emp.id)
}
const deleteEmpByIds = () => {
  ElMessageBox.confirm(
    '你真的要批量删除这些员工吗?',
    '提示',
    {
      confirmButtonText: '是的',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const result = await deleteEmpApi(selectIds.value)
      if(result.code){
        ElMessage.success('批量删除员工成功')
        searchEmp()
      }
      else{
        ElMessage.error(result.msg)
      }
    }).catch(()=>{
      ElMessage.info('已取消删除')
    })
}
</script>

<template>
  <h1 style="color:#409EFF;">员工管理</h1>

  <!-- 搜索表单区域 -->
  <div class="container">
    <el-form :inline="true" :model="empSearchInfo" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="empSearchInfo.name" placeholder="请输入员工姓名" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="empSearchInfo.gender" placeholder="请选择" clearable>
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="block">
          <span class="demonstration" style="margin-right: 20px;color: #606266;">入职日期</span>
          <el-date-picker v-model="empSearchInfo.date" type="daterange" range-separator="到" start-placeholder="开始日期"
            end-placeholder="结束日期" :size="small" value value-format="YYYY-MM-DD">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchEmp">查询</el-button>
        <el-button type="info" @click="clearSearchInfo">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 操作按钮区域 -->
  <div>
    <el-button type="primary" @click="addEmp">新增员工</el-button>
    <el-button type="primary" @click="deleteEmpByIds">批量删除</el-button>
  </div>

  <!-- 员工表格展示区域 -->
  <div class="container">
    <el-table :data="empList" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column prop="date" type="selection" label="" width="70" align="center" />
      <el-table-column prop="name" label="姓名" width="100" align="center" />
      <el-table-column label="性别" width="70" align="center">
        <template #default="scope">
          {{ scope.row.gender == 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="100" align="center">
        <template #default="scope">
          <img :src="scope.row.image" height="30px">
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门" width="100" align="center">
      </el-table-column>
      <el-table-column label="职位" width="90" align="center">
        <template #default="scope">
          {{ jobMap[scope.row.job] || '其他' }}
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职日期" width="130" align="center" />

      <el-table-column prop="updateTime" label="最后操作时间" width="180" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="editEmp(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteEmp(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 新增/编辑员工对话框 -->
  <div>
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="empInfo" label-width="80px" :rules="empFormRules" ref="empFromRef">
        <!-- 基本信息 -->
        <!-- 第一行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="empInfo.username" placeholder="请输入员工用户名，2-20个字"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="empInfo.name" placeholder="请输入员工姓名，2-10个字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="empInfo.gender" placeholder="请选择性别" style="width: 100%;">
                <el-option v-for="gender in genders" :key="gender.name" :label="gender.name"
                  :value="gender.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="empInfo.phone" placeholder="请输入员工手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职位">
              <el-select v-model="empInfo.job" placeholder="请选择职位" style="width: 100%;">
                <el-option v-for="job in jobs" :key="job.name" :label="job.name" :value="job.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资">
              <el-input v-model="empInfo.salary" placeholder="请输入员工薪资"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门">
              <el-select v-model="empInfo.deptId" placeholder="请选择部门" style="width: 100%;">
                <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期">
              <el-date-picker v-model="empInfo.entryDate" type="date" style="width: 100%;" placeholder="选择日期"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="头像">
              <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="empInfo.image" :src="empInfo.image" class="avatar" height="56px" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>


        <!-- 工作经历 -->
        <!-- 第六行 -->
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="工作经历">
              <el-button type="success" size="small" @click="addEmpExper">+ 添加工作经历</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第七行 ...  工作经历 -->
        <el-row :gutter="3" v-for="(exper, index) in empInfo.workExperiences" :key="index">
          <el-col :span="10">
            <el-form-item size="small" label="时间" label-width="80px">
              <el-date-picker type="daterange" v-model="exper.experDate" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item size="small" label="公司" label-width="60px">
              <el-input placeholder="请输入公司名称" v-model="exper.company"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item size="small" label="职位" label-width="60px">
              <el-input placeholder="请输入职位" v-model="exper.job"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-form-item size="small" label-width="0px">
              <el-button type="danger" @click="deleteExper(index)">- 删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEmp">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <!-- 分页组件 -->
  <div class="container">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 40]"
      :size="size" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<style scoped>
/* 容器样式 */
.container {
  margin-top: 20px;
}

.avatar {
  height: 40px;
}

.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 56px;
  height: 56px;
  text-align: center;
  /* 添加灰色的虚线边框 */
  border: 1px dashed var(--el-border-color);
}
</style>