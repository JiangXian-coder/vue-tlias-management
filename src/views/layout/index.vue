<script setup>

</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">Tlias智能学习辅助系统</span>
        <span class="right_tool">
          <a href="">
            <el-icon>
              <EditPen />
            </el-icon> 修改密码 &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
          </a>
          <a href="">
            <el-icon>
              <SwitchButton />
            </el-icon> 退出登录
          </a>
        </span>
      </el-header>

      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <!-- 左侧菜单栏 -->
          <el-menu router>
            <el-menu-item index="/index">
              <el-icon>
                <HomeFilled />
              </el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon>
                  <Avatar />
                </el-icon>
                <span>班级学员管理</span>
              </template>
              <el-menu-item index="/clazz">
                <el-icon>
                  <List />
                </el-icon>班级管理</el-menu-item>
              <el-menu-item index="/stu">
                <el-icon>
                  <UserFilled />
                </el-icon>学员管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/system">
              <template #title>
                <el-icon>
                  <Avatar />
                </el-icon>
                <span>系统信息管理</span>
              </template>
              <el-menu-item index="/dept">
                <el-icon>
                  <List />
                </el-icon>部门管理</el-menu-item>
              <el-menu-item index="/emp">
                <el-icon>
                  <UserFilled />
                </el-icon>员工管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/report">
              <template #title>
                <el-icon>
                  <Avatar />
                </el-icon>
                <span>数据统计管理</span>
              </template>
              <el-menu-item index="/report/emp">
                <el-icon>
                  <List />
                </el-icon>员工统计</el-menu-item>
              <el-menu-item index="/report/stu">
                <el-icon>
                  <UserFilled />
                </el-icon>学员统计</el-menu-item>
              <el-menu-item index="/log">
                <el-icon>
                  <Histogram />
                </el-icon>日志</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-main>
          <!-- 右侧核心展示区域 -->
          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(to right, #00547d, #007fa4, #00aaa0, #00d072, #a8eb12);
}

.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool {
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 730px;
}
</style>
